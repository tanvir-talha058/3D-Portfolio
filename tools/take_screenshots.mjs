import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.DEV_URL || 'http://localhost:3001/';
const ARTIFACT_DIR =
  'C:/Users/upay/.gemini/antigravity-ide/brain/ecc8c452-caee-49c4-b5a9-1b719a01c52e';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function captureScreenshots() {
  console.log(`Launching Chromium to capture screenshots of ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Hero Dark Mode
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_01_hero_dark.png') });
    console.log('Saved ss_01_hero_dark.png');

    // 2. Hero Light Mode
    const themeBtn = page
      .locator(
        'button[aria-label*="theme" i], button[title*="theme" i], button:has-text("Theme"), .theme-switcher-btn, [data-testid="theme-toggle"]'
      )
      .first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_02_hero_light.png') });
      console.log('Saved ss_02_hero_light.png');
      // Switch back to Dark
      await themeBtn.click();
      await page.waitForTimeout(400);
    }

    // 3. Command Center Modal
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_03_command_center.png') });
    console.log('Saved ss_03_command_center.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // 4. Recruiter Cheat Sheet Modal
    const recruiterBtn = page.locator('button:has-text("Recruiter Cheat Sheet")').first();
    if (await recruiterBtn.isVisible()) {
      await recruiterBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_04_recruiter_modal.png') });
      console.log('Saved ss_04_recruiter_modal.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // 5. Project Detail Modal
    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const deepDiveBtn = page.locator('#projects button:has-text("Deep Dive")').first();
    if (await deepDiveBtn.isVisible()) {
      await deepDiveBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_05_project_modal.png') });
      console.log('Saved ss_05_project_modal.png');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // 6. Playground - Multilingual RAG
    const playground = page.locator('#playground');
    await playground.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const ragTab = page.locator('#playground-tab-rag');
    if (await ragTab.isVisible()) {
      await ragTab.click();
      await page.waitForTimeout(500);
      const askBtn = page.locator('#playground button:has-text("Execute RAG")').first();
      if (await askBtn.isVisible()) {
        await askBtn.click();
        await page.waitForTimeout(1400);
      }
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_06_playground_rag.png') });
      console.log('Saved ss_06_playground_rag.png');
    }

    // 7. Playground - FinTech Anomaly Scorer
    const fraudTab = page.locator('#playground-tab-fraud');
    if (await fraudTab.isVisible()) {
      await fraudTab.click();
      await page.waitForTimeout(400);
      const evalBtn = page
        .locator('#playground button:has-text("Evaluate Anomaly Risk Score")')
        .first();
      if (await evalBtn.isVisible()) {
        await evalBtn.click();
        await page.waitForTimeout(600);
      }
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_07_playground_fraud.png') });
      console.log('Saved ss_07_playground_fraud.png');
    }

    // 8. Playground - Dialect Classifier
    const dialectTab = page.locator('#playground-tab-dialect');
    if (await dialectTab.isVisible()) {
      await dialectTab.click();
      await page.waitForTimeout(400);
      const classifyBtn = page.locator('#playground button:has-text("Predict Region")').first();
      if (await classifyBtn.isVisible()) {
        await classifyBtn.click();
        await page.waitForTimeout(800);
      }
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_08_playground_dialect.png') });
      console.log('Saved ss_08_playground_dialect.png');
    }

    // 9. Research & Skills Sections
    const research = page.locator('#research');
    await research.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_09_research.png') });
    console.log('Saved ss_09_research.png');

    // 10. Mobile Viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ss_10_mobile_hero.png') });
    console.log('Saved ss_10_mobile_hero.png');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }

  console.log(`\nScreenshot capture finished. Total console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors found:', consoleErrors);
  }
}

captureScreenshots();
