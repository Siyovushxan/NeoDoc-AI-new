import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai';
import { generateDocxBuffer } from '@/lib/docx-generator';
import { generatePptxBuffer } from '@/lib/pptx-generator';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(request: Request) {
  let body: any = null;

  try {
    body = await request.json();
    const { topic, type, lang, userId, additionalNotes, documentId } = body;

    if (!topic || !type || !lang || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Foydalanuvchi va kredit tekshiruvi
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
    let fileName: string;

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

    fileName = `${type}_${Date.now()}.${extension}`;

    // Firestore: status yangilash
    if (documentId) {
      await updateDoc(doc(db, 'documents', documentId), {
        status: 'ready',
        fileName,
        fileSize: buffer.length,
      });
    }

    // Kredit ayirish
    await updateDoc(userRef, {
      credits: increment(-1),
    });

    // Faylni to'g'ridan-to'g'ri qaytarish
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': buffer.length.toString(),
    },
  });

  } catch (error: any) {
    console.error('Generation API Error:', error);

    if (body?.documentId) {
      try {
        await updateDoc(doc(db, 'documents', body.documentId), {
          status: 'failed',
        });
      } catch (e) {
        console.error('Failed to update document status:', e);
      }
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}