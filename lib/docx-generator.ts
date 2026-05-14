import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Footer, PageNumber, NumberFormat, SectionType } from 'docx';

export async function generateDocxBuffer(data: any, type: string, isFree: boolean): Promise<Buffer> {
  const chapters = data.chapters || [];
  
  // Watermark Paragraph (Diagonal text effect for free users)
  const watermark = isFree ? new Paragraph({
    children: [
      new TextRun({
        text: "NeoDoc AI - Bepul Versiya",
        color: "E5E5E5",
        size: 80,
        bold: true,
      }),
    ],
    alignment: AlignmentType.CENTER,
  }) : null;

  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        headers: {
          default: new Header({
            children: isFree ? [watermark!] : [],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Title Page (Simplified for now)
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 2400, after: 1200 },
          }),
          ...(data.coverInfo ? [
            new Paragraph({ text: data.coverInfo.university || "", alignment: AlignmentType.CENTER }),
            new Paragraph({ text: data.coverInfo.faculty || "", alignment: AlignmentType.CENTER }),
          ] : []),
          
          // Table of Contents Placeholder
          new Paragraph({ text: "MUNDARIJA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 1000 } }),
          ...chapters.map((c: any) => new Paragraph({ text: c.heading, spacing: { before: 200 } })),

          // Introduction
          new Paragraph({ text: "KIRISH", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 1000 } }),
          new Paragraph({ text: data.introduction, alignment: AlignmentType.JUSTIFY }),

          // Main Chapters
          ...chapters.flatMap((chapter: any) => [
            new Paragraph({
              text: chapter.heading,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 1000, after: 400 },
            }),
            new Paragraph({
              text: chapter.content,
              alignment: AlignmentType.JUSTIFY,
            }),
            ...(chapter.subsections || []).flatMap((sub: any) => [
              new Paragraph({
                text: sub.heading,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Paragraph({
                text: sub.content,
                alignment: AlignmentType.JUSTIFY,
              }),
            ])
          ]),

          // Conclusion
          new Paragraph({ text: "XULOSA", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 1000 } }),
          new Paragraph({ text: data.conclusion, alignment: AlignmentType.JUSTIFY }),

          // References
          new Paragraph({ text: "FOYDALANILGAN ADABIYOTLAR", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 1000 } }),
          ...(data.references || []).map((ref: string) => new Paragraph({ text: `- ${ref}`, bullet: { level: 0 } })),
          
          // Test Questions (for mustaqil ta'lim)
          ...(data.testQuestions ? [
            new Paragraph({ text: "TEST SAVOLLARI", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 1000 } }),
            ...data.testQuestions.map((q: string) => new Paragraph({ text: q, bullet: { level: 0 } }))
          ] : []),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}