import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/upay/.gemini/antigravity-ide/brain/ecc8c452-caee-49c4-b5a9-1b719a01c52e';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero with Impact Metrics Strip
  await page.locator('#hero').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('#hero').screenshot({
    path: path.join(ARTIFACT_DIR, 'ss_hero_metrics.png')
  });

  // 2. Projects with Simulator CTAs
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('#projects').screenshot({
    path: path.join(ARTIFACT_DIR, 'ss_projects_simulator_cta.png')
  });

  // 3. Playground with Scenario Chips (RAG and Fraud)
  await page.locator('#playground').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Switch to RAG tab
  const ragTab = page.locator('#playground-tab-rag');
  if (await ragTab.count() > 0) {
    await ragTab.click();
    await page.waitForTimeout(600);
    await page.locator('#playground').screenshot({
      path: path.join(ARTIFACT_DIR, 'ss_playground_rag_scenarios.png')
    });
  }

  // Switch to Fraud tab
  const fraudTab = page.locator('#playground-tab-fraud');
  if (await fraudTab.count() > 0) {
    await fraudTab.click();
    await page.waitForTimeout(600);
    // Click critical scenario
    const criticalPreset = page.locator('text=Midnight Takeover');
    if (await criticalPreset.count() > 0) {
      await criticalPreset.click();
      await page.waitForTimeout(600);
    }
    await page.locator('#playground').screenshot({
      path: path.join(ARTIFACT_DIR, 'ss_playground_fraud_scenarios.png')
    });
  }

  // 4. Contact Section with Quick Inquiry Intent Chips
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  // Click 'Hiring for AI Role'
  const hiringChip = page.locator('text=Hiring for AI Role');
  if (await hiringChip.count() > 0) {
    await hiringChip.click();
    await page.waitForTimeout(300);
  }
  await page.locator('#contact').screenshot({
    path: path.join(ARTIFACT_DIR, 'ss_contact_quick_intents.png')
  });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
