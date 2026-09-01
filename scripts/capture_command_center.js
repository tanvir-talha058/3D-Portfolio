import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0', timeout: 30000 });

  // Open Command Center via keyboard
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyK');
  await page.keyboard.up('Control');

  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'e:/portfolio/screenshot_command_center.png' });
  console.log('COMMAND_CENTER_SCREENSHOT_CAPTURED');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
