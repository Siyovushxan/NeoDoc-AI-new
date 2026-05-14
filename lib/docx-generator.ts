import { Document, Packer, Paragraph, TextRun, PageBreak, Table, TableRow, TableCell, UnderlineType } from 'docx';

export interface DocxGenerationOptions {
  title: string;
  type: 'referat' | 'kurs_ishi' | 'mustaqil_talim';
  content: any;
  language: 'uz' | 'ru' | 'en';
  addWatermark?: boolean;
}

function createCoverPage(options: DocxGenerationOptions): Paragraph[] {
  const { content, title, language } = options;
  const langText = {
    uz: { university: 'TOSHKENT DAVLAT UNIVERSITETI', kurs: 'KURS ISHI', bajardi: 'Bajardi:', tekshirdi: 'Tekshirdi:' },
    ru: { university: 'ТАШКЕНТСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ', kurs: 'КУРСОВАЯ РАБОТА', bajardi: 'Выполнил:', tekshirdi: 'Проверил:' },
    en: { university: 'TASHKENT STATE UNIVERSITY', kurs: 'TERM PAPER', bajardi: 'Author:', tekshirdi: 'Reviewer:' },
  };

  const lang = langText[language];

  return [
    new Paragraph({
      text: lang.university,
      alignment: 'center',
      spacing: { line: 240 },
      style: 'Normal',
    }),
    new Paragraph({
      text: content.coverInfo?.faculty || '',
      alignment: 'center',
      spacing: { line: 240 },
    }),
    new Paragraph({
      text: content.coverInfo?.department || '',
      alignment: 'center',
      spacing: { line: 240 },
    }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph({
      text: title,
      alignment: 'center',
      bold: true,
      size: 32,
      spacing: { line: 240 },
    }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph(`${lang.bajardi} _________________`),
    new Paragraph(`${lang.tekshirdi} _________________`),
    new Paragraph({ text: '' }),
    new Paragraph({ text: '' }),
    new Paragraph({
      text: `Toshkent — ${new Date().getFullYear()}`,
      alignment: 'center',
    }),
    new PageBreak(),
  ];
}

function createTableOfContents(content: any): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: 'MUNDARIJA',
      bold: true,
      size: 32,
      spacing: { line: 240 },
    }),
    new Paragraph({ text: '' }),
  ];

  if (content.chapters && Array.isArray(content.chapters)) {
    content.chapters.forEach((chapter: any, index: number) => {
      paragraphs.push(
        new Paragraph({
          text: `${index + 1}. ${chapter.heading}`,
          spacing: { line: 240 },
        })
      );
    });
  }

  paragraphs.push(
    new Paragraph({ text: '' }),
    new Paragraph('FOYDALANILGAN ADABIYOTLAR'),
    new PageBreak()
  );

  return paragraphs;
}

function createContentParagraphs(content: any): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Introduction
  if (content.introduction) {
    paragraphs.push(
      new Paragraph({
        text: 'KIRISH',
        bold: true,
        size: 32,
        spacing: { line: 240 },
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: content.introduction,
        spacing: { line: 360 },
        alignment: 'justified',
      }),
      new PageBreak()
    );
  }

  // Chapters
  if (content.chapters && Array.isArray(content.chapters)) {
    content.chapters.forEach((chapter: any, index: number) => {
      paragraphs.push(
        new Paragraph({
          text: `${index + 1}-BOB. ${chapter.heading.toUpperCase()}`,
          bold: true,
          size: 28,
          spacing: { line: 240 },
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: chapter.content,
          spacing: { line: 360 },
          alignment: 'justified',
        })
      );

      if (chapter.subsections && Array.isArray(chapter.subsections)) {
        chapter.subsections.forEach((subsection: any, subIndex: number) => {
          paragraphs.push(
            new Paragraph({
              text: subsection.heading,
              bold: true,
              size: 24,
              spacing: { line: 240 },
            }),
            new Paragraph({
              text: subsection.content,
              spacing: { line: 360 },
              alignment: 'justified',
            })
          );
        });
      }

      if (index < content.chapters.length - 1) {
        paragraphs.push(new PageBreak());
      }
    });
  }

  // Conclusion
  if (content.conclusion) {
    paragraphs.push(
      new PageBreak(),
      new Paragraph({
        text: 'XULOSA',
        bold: true,
        size: 32,
        spacing: { line: 240 },
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        text: content.conclusion,
        spacing: { line: 360 },
        alignment: 'justified',
      })
    );
  }

  // References
  if (content.references && Array.isArray(content.references)) {
    paragraphs.push(
      new PageBreak(),
      new Paragraph({
        text: 'FOYDALANILGAN ADABIYOTLAR',
        bold: true,
        size: 32,
        spacing: { line: 240 },
      }),
      new Paragraph({ text: '' })
    );

    content.references.forEach((ref: string, index: number) => {
      paragraphs.push(
        new Paragraph({
          text: `${index + 1}. ${ref}`,
          spacing: { line: 240 },
        })
      );
    });
  }

  return paragraphs;
}

export async function generateDocx(options: DocxGenerationOptions): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];

  // Add cover page
  paragraphs.push(...createCoverPage(options));

  // Add table of contents
  paragraphs.push(...createTableOfContents(options.content));

  // Add main content
  paragraphs.push(...createContentParagraphs(options.content));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margins: {
              top: 1440,
              right: 1080,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
