import { chromium } from 'playwright';
import path from 'path';

const BASE_URL = process.env.DEV_URL || 'http://localhost:3001/';
const ARTIFACT_DIR = 'C:/Users/upay/.gemini/antigravity-ide/brain/ecc8c452-caee-49c4-b5a9-1b719a01c52e';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Locate the right action bar in navbar
  const actionBar = page.locator('nav .container > div:has(#desktop-resume-btn)');
  if (await actionBar.isVisible()) {
    await actionBar.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_navbar_buttons_dark.png') });
    console.log('Saved ss_navbar_buttons_dark.png');
  } else {
    // Fallback: full nav screenshot
    await page.locator('nav').screenshot({ path: path.join(ARTIFACT_DIR, 'ss_navbar_buttons_dark.png') });
    console.log('Saved fallback ss_navbar_buttons_dark.png');
  }

  // Toggle theme to light mode and capture
  const themeBtn = page.locator('.theme-toggle-btn').first();
  if (await themeBtn.isVisible()) {
    await themeBtn.click();
    await page.waitForTimeout(500);
    if (await actionBar.isVisible()) {
      await actionBar.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_navbar_buttons_light.png') });
      console.log('Saved ss_navbar_buttons_light.png');
    }
  }

  await browser.close();
}

main().catch(console.error);
