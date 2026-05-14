import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export interface PngGenerationOptions {
  title: string;
  content: any;
  language: 'uz' | 'ru' | 'en';
}

export async function generatePng(options: PngGenerationOptions): Promise<Buffer> {
  // In a development environment, you can set the CHROME_EXECUTABLE_PATH env variable
  // to your local Chrome installation to bypass downloading Chromium.
  // This is useful for corporate networks or to avoid download errors.
  const executablePath =
    process.env.NODE_ENV !== 'production' && process.env.CHROME_EXECUTABLE_PATH
      ? process.env.CHROME_EXECUTABLE_PATH
      : await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    },
    executablePath: executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { margin: 0; padding: 40px; font-family: Arial, sans-serif; background: white; width: 1080px; height: 1920px; box-sizing: border-box; }
      .container { text-align: center; }
      .title { font-size: 56px; font-weight: bold; margin-bottom: 20px; color: #1E3A5F; }
      .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin: 40px 0; }
      .stat-card { background: #F5C518; padding: 40px; border-radius: 15px; color: #1E3A5F; }
      .stat-value { font-size: 48px; font-weight: bold; }
      .stat-label { font-size: 20px; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">${options.title}</div>
      <div class="stats">
        ${
          options.content.stats
            ?.map(
              (stat: any) => `
            <div class="stat-card">
              <div class="stat-value">${stat.value}</div>
              <div class="stat-label">${stat.label}</div>
            </div>
          `
            )
            .join('') || ''
        }
      </div>
    </div>
  </body>
  </html>
`;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const screenshotBuffer = await page.screenshot({
    type: 'png',
    encoding: 'binary',
  });

  await browser.close();

  return screenshotBuffer as Buffer;
}
