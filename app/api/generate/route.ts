import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai';
import { generateDocxBuffer } from '@/lib/docx-generator';
import { generatePptxBuffer } from '@/lib/pptx-generator';
import { serverDb, serverStorage } from '@/lib/firebase-server';
import {
  doc, getDoc, updateDoc, addDoc,
  collection, increment, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  let body: any = null;

  try {
    body = await request.json();
    const { topic, type, lang, userId, additionalNotes } = body;

    // Majburiy maydonlar tekshiruvi
    if (!topic || !type || !lang || !userId) {
      return NextResponse.json(
        { error: 'topic, type, lang, userId majburiy' },
        { status: 400 }
      );
    }

    // Foydalanuvchi tekshiruvi
    const userRef = doc(serverDb, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    const userData = userSnap.data() || {};
    if ((userData.credits ?? 0) < 1) {
      return NextResponse.json({ error: 'Kreditlar yetarli emas' }, { status: 403 });
    }

    const isFree = userData.plan === 'free';

    // AI kontent generatsiya
    const aiContent = await generateAIContent({
      topic,
      type,
      language: lang,
      additionalNotes,
    });

    // Fayl generatsiya
    let buffer: Buffer;
    let extension: string;
    let contentType: string;

    if (type === 'presentation') {
      buffer = await generatePptxBuffer(aiContent, isFree);
      extension = 'pptx';
      contentType =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (['referat', 'kurs_ishi', 'mustaqil_talim'].includes(type)) {
      buffer = await generateDocxBuffer(aiContent, type, isFree);
      extension = 'docx';
      contentType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      return NextResponse.json(
        { error: 'Bu hujjat turi hali qo\'llab-quvvatlanmaydi' },
        { status: 400 }
      );
    }

    const fileName = `${type}_${Date.now()}.${extension}`;

    // Firebase Storage ga yuklash
    let downloadUrl = '';
    try {
      const fileRef = ref(serverStorage, `documents/${userId}/${fileName}`);
      await uploadBytes(fileRef, buffer, { contentType });
      downloadUrl = await getDownloadURL(fileRef);
    } catch (storageErr) {
      console.warn('Storage upload xatosi:', storageErr);
    }

    // Firestore ga hujjat saqlash
    const newDocRef = await addDoc(collection(serverDb, 'documents'), {
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

    // Base64 va metadata qaytarish
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
    console.error('Generation xatosi:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Server xatosi',
        hint: 'Firebase Security Rules yoki Credential muammosi bo\'lishi mumkin',
      },
      { status: 500 }
    );
  }
}