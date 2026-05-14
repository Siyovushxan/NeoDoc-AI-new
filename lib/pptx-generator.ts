import PptxGenJs from 'pptxgenjs';

export interface PptxGenerationOptions {
  title: string;
  content: any;
  language: 'uz' | 'ru' | 'en';
}

const colorThemes: Record<string, { primary: string; accent: string; bg: string }> = {
  blue: { primary: '#1E3A5F', accent: '#3B82F6', bg: '#F5C518' },
  green: { primary: '#14532D', accent: '#22C55E', bg: '#DCFCE7' },
  orange: { primary: '#7C2D12', accent: '#F97316', bg: '#FFF7ED' },
  purple: { primary: '#1E1B4B', accent: '#818CF8', bg: '#EEF2FF' },
};

export async function generatePptx(options: PptxGenerationOptions): Promise<Buffer> {
  const pres = new PptxGenJs();
  pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });

  const theme = colorThemes[options.content.colorTheme || 'blue'];

  // Slide 1 - Title Slide
  const slide1 = pres.addSlide();
  slide1.background = { color: theme.primary };
  slide1.addText(options.title, {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 2,
    fontSize: 54,
    bold: true,
    color: '#FFFFFF',
    align: 'center',
    fontFace: 'Arial',
  });
  slide1.addText('NeoDoc AI', {
    x: 0.5,
    y: 6.5,
    w: 9,
    h: 0.5,
    fontSize: 12,
    color: '#FFFFFF',
    align: 'center',
    fontFace: 'Arial',
  });

  // Content Slides
  if (options.content.slides && Array.isArray(options.content.slides)) {
    options.content.slides.forEach((slideData: any) => {
      const slide = pres.addSlide();
      slide.background = { color: '#FFFFFF' };

      // Header with accent
      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.8,
        fill: { color: theme.primary },
      });

      // Title
      slide.addText(slideData.heading, {
        x: 0.5,
        y: 0.15,
        w: 9,
        h: 0.5,
        fontSize: 44,
        bold: true,
        color: '#FFFFFF',
        fontFace: 'Arial',
      });

      // Content bullets
      if (slideData.bullets && Array.isArray(slideData.bullets)) {
        let yPos = 1.2;
        slideData.bullets.forEach((bullet: string) => {
          slide.addText('• ' + bullet, {
            x: 1,
            y: yPos,
            w: 8,
            h: 1,
            fontSize: 20,
            color: '#333333',
            fontFace: 'Arial',
            wrap: true,
          });
          yPos += 1.2;
        });
      }

      // Footer
      slide.addText(`Page ${slideData.slideNumber}`, {
        x: 9,
        y: 7,
        w: 0.8,
        h: 0.3,
        fontSize: 10,
        color: '#999999',
        align: 'right',
      });
    });
  }

  // Convert to buffer
  const arrayBuffer = await pres.writeBuffer();
  return Buffer.from(arrayBuffer);
}
