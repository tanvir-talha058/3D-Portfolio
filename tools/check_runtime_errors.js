import puppeteer from 'puppeteer-core';

const chromePath =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const devUrl = process.env.DEV_URL || 'http://127.0.0.1:3000/';

async function checkErrors() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    pageErrors.push(`[PAGE_ERROR] ${err.toString()}`);
  });

  try {
    await page.goto(devUrl, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));
  } catch (err) {
    pageErrors.push(`[GOTO_ERROR] ${err.toString()}`);
  }

  console.log('--- CONSOLE LOGS ---');
  consoleMessages.forEach((m) => console.log(m));
  console.log('--- PAGE ERRORS ---');
  pageErrors.forEach((e) => console.log(e));

  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY HTML LENGTH:', bodyHtml.length);

  await browser.close();
}

checkErrors().catch(console.error);
