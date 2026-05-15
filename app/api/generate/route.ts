import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai';
import { generateDocxBuffer } from '@/lib/docx-generator';
import { generatePptxBuffer } from '@/lib/pptx-generator';
import { db, storage } from '@/lib/firebase';
import {
  doc, getDoc, updateDoc, addDoc,
  collection, increment, serverTimestamp,
} from 'firebase/firestore';

export async function POST(request: Request) {
  let body: any = null;

  try {
    body = await request.json();
    const { topic, type, lang, userId, additionalNotes } = body;

    if (!topic || !type || !lang || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    if (userData.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const isFree = userData.plan === 'free';

    const aiContent = await generateAIContent({
      topic, type, language: lang, additionalNotes,
    });

    let buffer: Buffer;
    let extension: string;
    let contentType: string;

    if (type === 'presentation') {
      buffer = await generatePptxBuffer(aiContent, isFree);
      extension = 'pptx';
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (['referat', 'kurs_ishi', 'mustaqil_talim'].includes(type)) {
      buffer = await generateDocxBuffer(aiContent, type, isFree);
      extension = 'docx';
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      return NextResponse.json({ error: 'Type not supported yet' }, { status: 400 });
    }

    const fileName = `${type}_${Date.now()}.${extension}`;

    // Firebase Storage ga yuklash
    let downloadUrl = '';
    try {
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const fileRef = ref(storage, `documents/${userId}/${fileName}`);
      await uploadBytes(fileRef, buffer, { contentType });
      downloadUrl = await getDownloadURL(fileRef);
    } catch (storageErr) {
      console.warn('Storage upload failed:', storageErr);
    }

    // Firestore ga saqlash
    const newDocRef = await addDoc(collection(db, 'documents'), {
      userId,
      title: topic,
      type,
      language: lang,
      status: 'ready',
      fileName,
      fileSize: buffer.length,
      fileUrl: downloadUrl,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Kredit ayirish
    await updateDoc(userRef, { credits: increment(-1) });

    return NextResponse.json({
      success: true,
      documentId: newDocRef.id,
      fileName,
      fileBase64: buffer.toString('base64'),
      contentType,
      fileSize: buffer.length,
      downloadUrl,
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}