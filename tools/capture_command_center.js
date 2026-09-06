import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..');
const chromePath =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const devUrl = process.env.DEV_URL || 'http://127.0.0.1:3000/';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(devUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Open Command Center via keyboard
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyK');
  await page.keyboard.up('Control');

  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(outDir, 'screenshot_command_center.png') });
  console.log('COMMAND_CENTER_SCREENSHOT_CAPTURED');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
