import pptxgen from 'pptxgenjs';

export async function generatePpptxBuffer(data: any, isFree: boolean): Promise<Buffer> {
  const pptx = new pptxgen();
  pptx.title = data.title;
  pptx.layout = 'LAYOUT_16x9';

  // Color themes
  const primaryColor = '4F46E5';
  const textColor = '333333';
  const watermarkColor = 'E5E5E5';

  data.slides.forEach((slideData: any) => {
    const slide = pptx.addSlide();
    
    // Background if title slide
    if (slideData.type === 'title') {
      slide.background = { color: primaryColor };
      slide.addText(slideData.heading, { x: 1, y: 1.5, w: '80%', fontSize: 44, bold: true, color: 'FFFFFF', align: 'center' });
      if (data.subtitle) {
        slide.addText(data.subtitle, { x: 1, y: 3.0, w: '80%', fontSize: 24, color: 'FFFFFF', transparency: 20, align: 'center' });
      }
    } else {
      // Header line for content slides
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 9.0, h: 0.05, fill: { color: primaryColor } });
      slide.addText(slideData.heading, { x: 0.5, y: 0.3, w: '90%', fontSize: 28, bold: true, color: primaryColor });
      
      if (slideData.bullets && slideData.bullets.length > 0) {
        slide.addText(slideData.bullets.map((b: string) => ({ text: b, options: { bullet: true, margin: [5, 0, 5, 0] } })), {
          x: 0.5, y: 1.2, w: '90%', h: '70%', fontSize: 18, color: textColor, valign: 'top'
        });
      }
    }

    // Footer
    slide.addText(`NeoDoc AI | ${slideData.slideNumber}`, { x: 0.5, y: 5.2, w: '90%', fontSize: 10, color: '999999', align: 'right' });

    // Watermark for free users
    if (isFree) {
      slide.addText("NeoDoc AI - Bepul Versiya", {
        x: 0,
        y: 5.2,
        w: '100%',
        fontSize: 12,
        bold: true,
        color: watermarkColor,
        align: 'center',
        transparency: 50
      });
    }
  });

  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return buffer as Buffer;
}