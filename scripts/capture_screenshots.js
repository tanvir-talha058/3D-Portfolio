import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=d3d11'
    ]
  });

  // 1. Desktop Night Mode (1440x900)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(outDir, 'screenshot_3d_desktop_dark.png') });

    // Toggle to Light Mode
    await page.evaluate(() => {
      const toggle = document.querySelector('button[aria-label="Switch to Light Mode"], button[title*="Day Mode"]');
      if (toggle) toggle.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(outDir, 'screenshot_3d_desktop_light.png') });
    await page.close();
  }

  // 2. Mobile (390x844)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(outDir, 'screenshot_3d_mobile_dark.png') });
    await page.close();
  }

  await browser.close();
  console.log('SCREENSHOTS_RENDERED_SUCCESSFULLY');
}

run().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
