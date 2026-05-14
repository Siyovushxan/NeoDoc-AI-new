import { NextResponse } from 'next/server';
import { generateAIContent } from '@/lib/ai';
import { generateDocxBuffer } from '@/lib/docx-generator';
import { generatePpptxBuffer } from '@/lib/pptx-generator';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, type, lang, userId, additionalNotes } = body;

    if (!topic || !type || !lang || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Foydalanuvchi ma'lumotlarini olish (kredit va plan tekshiruvi)
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

    // 2. AI orqali kontent generatsiya qilish
    const aiContent = await generateAIContent({
      topic,
      type,
      language: lang,
      additionalNotes
    });

    // 3. Faylni generatsiya qilish (Generator tanlash)
    let buffer: Buffer;
    let extension: string;
    let contentType: string;

    if (type === 'presentation') {
      buffer = await generatePpptxBuffer(aiContent, isFree);
      extension = 'pptx';
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (['referat', 'kurs_ishi', 'mustaqil_talim'].includes(type)) {
      buffer = await generateDocxBuffer(aiContent, type, isFree);
      extension = 'docx';
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      // Placeholder for PNG/Infographic
      return NextResponse.json({ error: 'Type not supported yet' }, { status: 400 });
    }

    // 4. Firebase Storage'ga yuklash
    const fileName = `${type}_${Date.now()}.${extension}`;
    const storagePath = `documents/${userId}/${fileName}`;
    const fileRef = ref(storage, storagePath);
    
    await uploadBytes(fileRef, buffer, { contentType });
    const downloadUrl = await getDownloadURL(fileRef);

    // 5. Firestore'ni yangilash (Status va Kredit)
    // Hujjatni qidirish (yaqinda yaratilgan statusi 'generating' bo'lgan hujjat)
    // Bu yerda odatda hujjat ID-si frontdan yuboriladi yoki qidiriladi.
    // Hozircha biz yangi hujjat yaratilganini front-end onSnapshot orqali bilib oladi deb hisoblaymiz.
    
    // Kreditni kamaytirish
    await updateDoc(userRef, {
      credits: increment(-1)
    });

    return NextResponse.json({
      success: true,
      fileName,
      downloadUrl,
      fileSize: buffer.length
    });

  } catch (error: any) {
    console.error('Generation API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Server error' 
    }, { status: 500 });
  }
}