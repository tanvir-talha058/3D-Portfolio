/* global document */
import { chromium } from 'playwright';

const BASE_URL = process.env.DEV_URL || 'http://localhost:3001/';

async function deepAudit() {
  console.log(`Starting deep audit on ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 1. Accessibility Checks: Images missing alt
  const missingAltImages = await page.$$eval('img:not([alt]), img[alt=""]', (imgs) =>
    imgs.map((img) => ({ src: img.src, class: img.className }))
  );

  // 2. Buttons missing accessible names
  const unnamedButtons = await page.$$eval('button', (btns) =>
    btns
      .filter((b) => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'))
      .map((b) => ({ html: b.outerHTML.slice(0, 100) }))
  );

  // 3. Heading hierarchy: count h1
  const h1Elements = await page.$$eval('h1', (h1s) => h1s.map((h) => h.innerText.trim()));

  // 4. Horizontal overflow check on mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(400);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const hasHorizontalScroll = scrollWidth > clientWidth;

  // 5. Check dialog accessibility
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(400);
  const dialogHasLabel = await page.evaluate(() => {
    const d = document.querySelector('dialog[open]');
    return d ? {
      hasAriaLabel: !!d.getAttribute('aria-label'),
      hasAriaLabelledby: !!d.getAttribute('aria-labelledby'),
      role: d.getAttribute('role')
    } : null;
  });

  console.log('\n--- AUDIT RESULTS ---');
  console.log('Console Errors:', consoleMessages.filter((m) => m.type === 'error'));
  console.log('Console Warnings:', consoleMessages.filter((m) => m.type === 'warning'));
  console.log('Page Uncaught Errors:', pageErrors);
  console.log('Missing Alt Images:', missingAltImages);
  console.log('Unnamed Buttons:', unnamedButtons);
  console.log('H1 Headings count:', h1Elements.length, h1Elements);
  console.log(`Mobile Overflow Check: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}, overflow=${hasHorizontalScroll}`);
  console.log('Command Center Dialog A11y:', dialogHasLabel);

  await browser.close();
}

deepAudit().catch(console.error);
