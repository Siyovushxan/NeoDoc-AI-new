import { NextRequest, NextResponse } from 'next/server';
import { generateAIContent, generateFallbackDocument } from '@/lib/ai';
import { generateDocx } from '@/lib/docx-generator';
import { generatePptx } from '@/lib/pptx-generator';
import { generatePng } from '@/lib/png-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, topic, language, additionalNotes } = body;

    if (!type || !topic || !language) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate content using AI
    let content;
    try {
      content = await generateAIContent({
        type,
        topic,
        language,
        additionalNotes,
      });
    } catch (aiError) {
      console.warn('AI generation failed, using fallback:', aiError);
      content = generateFallbackDocument({ type, topic, language, additionalNotes });
    }

    // Generate file based on type
    let buffer: Buffer;
    let mimeType: string;
    let filename: string;

    switch (type) {
      case 'presentation':
        buffer = await generatePptx({ title: content.title, content, language });
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        filename = `${content.title || 'presentation'}.pptx`;
        break;

      case 'referat':
      case 'kurs_ishi':
      case 'mustaqil_talim':
        buffer = await generateDocx({ title: content.title || topic, type, content, language });
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `${content.title || topic}.docx`;
        break;

      case 'infografika':
        buffer = await generatePng({ title: content.title, content, language });
        mimeType = 'image/png';
        filename = `${content.title || 'infografika'}.png`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      },
    });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate document',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
