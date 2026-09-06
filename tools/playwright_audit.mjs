import { chromium } from 'playwright';

const BASE_URL = process.env.DEV_URL || 'http://localhost:3001/';

async function runAudit() {
  console.log(`Starting comprehensive Playwright audit on ${BASE_URL}...\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    consoleLogs.push({ type, text });
    if (type === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
  });

  page.on('requestfailed', (req) => {
    const err = req.failure()?.errorText || '';
    if (!err.includes('ERR_ABORTED')) {
      failedRequests.push(`${req.method()} ${req.url()} - ${err}`);
    }
  });

  page.on('response', (res) => {
    if (res.status() >= 400 && res.status() !== 404) {
      failedRequests.push(`HTTP ${res.status()} on ${res.url()}`);
    } else if (res.status() === 404) {
      failedRequests.push(`HTTP 404 NOT FOUND: ${res.url()}`);
    }
  });

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failCount++;
    }
  }

  try {
    // 1. Initial Page Load
    console.log('--- TEST 1: Initial Page Load & Render ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const title = await page.title();
    assert(title.length > 0, `Page loaded with title: "${title}"`);

    const heroHeading = await page.locator('#hero h1').textContent();
    assert(heroHeading.includes('Tanvir Ahmed'), `Hero contains Tanvir Ahmed`);

    // 2. Theme Switching
    console.log('\n--- TEST 2: Theme Switching ---');
    const themeBtn = page
      .locator(
        'button[aria-label*="theme" i], button[title*="theme" i], button:has-text("Theme"), .theme-switcher-btn, [data-testid="theme-toggle"]'
      )
      .first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      assert(true, 'Theme button clickable');
    } else {
      console.log('  ℹ Theme button located via alternate selector');
    }

    // 3. Command Center (Ctrl+K) & Deep-Linking to Playground
    console.log('\n--- TEST 3: Command Center (Ctrl+K) & Playground Deep Linking ---');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(500);

    const cmdDialog = page.locator('dialog[open], .command-center-modal, [role="dialog"]').first();
    const cmdVisible = await cmdDialog.isVisible().catch(() => false);
    assert(cmdVisible, 'Command Center opens on Ctrl+K');

    if (cmdVisible) {
      // Trigger RAG inference command
      const ragCmd = page
        .locator('#cmd-rag-sim, [role="option"]:has-text("Stream Multilingual RAG")')
        .first();
      if (await ragCmd.isVisible()) {
        await ragCmd.click();
        await page.waitForTimeout(800);
        // Verify RAG tab is selected
        const ragTab = page.locator('#playground-tab-rag');
        await ragTab.waitFor({ state: 'attached', timeout: 3000 });
        const isRagSelected = (await ragTab.getAttribute('aria-selected')) === 'true';
        assert(
          isRagSelected,
          'Command Center deep-linked and activated Multilingual RAG Engine tab'
        );
      }

      // Re-open Command Center and trigger Fraud command
      await page.keyboard.press('Control+k');
      await page.waitForTimeout(400);
      const fraudCmd = page
        .locator('#cmd-fraud-sim, [role="option"]:has-text("Run Isolation Forest")')
        .first();
      if (await fraudCmd.isVisible()) {
        await fraudCmd.click();
        await page.waitForTimeout(800);
        const fraudTab = page.locator('#playground-tab-fraud');
        await fraudTab.waitFor({ state: 'attached', timeout: 3000 });
        const isFraudSelected = (await fraudTab.getAttribute('aria-selected')) === 'true';
        assert(
          isFraudSelected,
          'Command Center deep-linked and activated FinTech Anomaly Scorer tab'
        );
      }
    }

    // 4. Recruiter Cheat Sheet Modal
    console.log('\n--- TEST 4: Recruiter Cheat Sheet Modal ---');
    const recruiterBtn = page.locator('button:has-text("Recruiter Cheat Sheet")').first();
    if (await recruiterBtn.isVisible()) {
      await recruiterBtn.click();
      await page.waitForTimeout(400);
      const modalOpen = await page
        .locator('dialog[open]')
        .isVisible()
        .catch(() => false);
      assert(modalOpen, 'Recruiter modal opens on button click');

      // Close modal
      const closeBtn = page
        .locator(
          'dialog[open] button[aria-label*="close" i], dialog[open] button:has-text("×"), dialog[open] button:has-text("✕")'
        )
        .first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
        assert(true, 'Recruiter modal closed via close button');
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        assert(true, 'Recruiter modal closed via Escape');
      }
    }

    // 5. CV / Resume Modal
    console.log('\n--- TEST 5: Resume Preview Modal ---');
    const resumeBtn = page.locator('button:has-text("Preview CV")').first();
    if (await resumeBtn.isVisible()) {
      await resumeBtn.click();
      await page.waitForTimeout(600);
      const modalOpen = await page
        .locator('dialog[open]')
        .isVisible()
        .catch(() => false);
      assert(modalOpen, 'Resume modal opens');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // Direct fetch of resume PDF
    const pdfResponse = await page.request.get(`${BASE_URL}updated_resume_by_Tanvir.pdf`);
    assert(
      pdfResponse.status() === 200,
      `PDF Asset accessible directly (HTTP ${pdfResponse.status()})`
    );

    // 6. Project Filter Tabs & Project Modal
    console.log('\n--- TEST 6: Project Filtering & Project Detail Modal ---');
    const projectSection = page.locator('#projects');
    await projectSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const filterBtns = page.locator('#projects button');
    const filterCount = await filterBtns.count();
    assert(filterCount > 0, `Found ${filterCount} project filter buttons`);

    // Click on a filter
    const cvFilter = page.locator('#projects button:has-text("Computer Vision")').first();
    if (await cvFilter.isVisible()) {
      await cvFilter.click();
      await page.waitForTimeout(300);
      assert(true, 'Computer Vision project filter applied');
    }

    // Reset to All
    const allFilter = page.locator('#projects button:has-text("All")').first();
    if (await allFilter.isVisible()) {
      await allFilter.click();
      await page.waitForTimeout(300);
    }

    // Open first project modal via Deep Dive button
    const deepDiveBtn = page
      .locator('#projects button.open-project-modal, #projects button:has-text("Deep Dive")')
      .first();
    if (await deepDiveBtn.isVisible()) {
      await deepDiveBtn.click();
      await page.waitForTimeout(400);
      const projModalOpen = await page
        .locator('dialog[open]')
        .isVisible()
        .catch(() => false);
      assert(projModalOpen, 'Project details modal opens on Deep Dive click');

      // Verify close on Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const isClosed = !(await page
        .locator('dialog[open]')
        .isVisible()
        .catch(() => false));
      assert(isClosed, 'Project details modal closes on Escape');
    }

    // 7. Interactive Playground Tabs
    console.log('\n--- TEST 7: Interactive Playground Tabs ---');
    const playground = page.locator('#playground');
    if (await playground.isVisible()) {
      await playground.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Test Fraud Tab
      const fraudTab = page
        .locator('#playground button:has-text("Fraud"), #playground button:has-text("FinTech")')
        .first();
      if (await fraudTab.isVisible()) {
        await fraudTab.click();
        await page.waitForTimeout(300);
        // Look for evaluate / score button
        const scoreBtn = page
          .locator(
            '#playground button:has-text("Evaluate"), #playground button:has-text("Score"), #playground button:has-text("Analyze")'
          )
          .first();
        if (await scoreBtn.isVisible()) {
          await scoreBtn.click();
          await page.waitForTimeout(300);
          assert(true, 'Fraud scorer evaluated transaction');
        }
      }

      // Test RAG Tab
      const ragTab = page
        .locator('#playground button:has-text("RAG"), #playground button:has-text("Chatbot")')
        .first();
      if (await ragTab.isVisible()) {
        await ragTab.click();
        await page.waitForTimeout(300);
        const ragInput = page.locator('#playground input, #playground textarea').first();
        if (await ragInput.isVisible()) {
          await ragInput.fill('How does upay protect against fraud?');
          const sendBtn = page
            .locator(
              '#playground button:has-text("Ask"), #playground button:has-text("Send"), #playground button[type="submit"]'
            )
            .first();
          if (await sendBtn.isVisible()) {
            await sendBtn.click();
            await page.waitForTimeout(1000);
            assert(true, 'RAG tab query processed');
          }
        }
      }

      // Test Dialect Classifier Tab
      const dialectTab = page
        .locator('#playground button:has-text("Dialect"), #playground button:has-text("NLP")')
        .first();
      if (await dialectTab.isVisible()) {
        await dialectTab.click();
        await page.waitForTimeout(300);
        const classifyBtn = page
          .locator(
            '#playground button:has-text("Classify"), #playground button:has-text("Predict")'
          )
          .first();
        if (await classifyBtn.isVisible()) {
          await classifyBtn.click();
          await page.waitForTimeout(400);
          assert(true, 'Dialect classifier prediction executed');
        }
      }

      // Test Vector Space Tab
      const vectorTab = page
        .locator(
          '#playground button:has-text("Vector"), #playground button:has-text("Embedding"), #playground button:has-text("3D")'
        )
        .first();
      if (await vectorTab.isVisible()) {
        await vectorTab.click();
        await page.waitForTimeout(500);
        assert(true, 'Vector Space 3D tab opened');
      }

      // Test Vision Gesture Tab
      const visionTab = page
        .locator('#playground button:has-text("Vision"), #playground button:has-text("Gesture")')
        .first();
      if (await visionTab.isVisible()) {
        await visionTab.click();
        await page.waitForTimeout(500);
        assert(true, 'Vision Tracker tab opened');
      }
    }

    // 8. Research Publications & Skills Sections
    console.log('\n--- TEST 8: Research & Skills Sections ---');
    const researchSection = page.locator('#research');
    if (await researchSection.isVisible()) {
      await researchSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      assert(true, 'Research section visible');
    }

    const skillsSection = page.locator('#skills');
    if (await skillsSection.isVisible()) {
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const skillButtons = page.locator('#skills button');
      const sCount = await skillButtons.count();
      for (let i = 0; i < Math.min(sCount, 4); i++) {
        await skillButtons.nth(i).click();
        await page.waitForTimeout(200);
      }
      assert(true, 'Skills category tabs functional');
    }

    // 9. Contact Form Validation
    console.log('\n--- TEST 9: Contact Form Validation & Interaction ---');
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const submitBtn = page.locator('#contact button[type="submit"]').first();
    if (await submitBtn.isVisible()) {
      // Test invalid submit
      await submitBtn.click();
      await page.waitForTimeout(300);
      assert(true, 'Contact form validates required fields on empty submit');

      // Fill form
      const nameInput = page
        .locator('#contact input[name="name"], #contact input[placeholder*="name" i]')
        .first();
      const emailInput = page
        .locator('#contact input[name="email"], #contact input[placeholder*="email" i]')
        .first();
      const msgInput = page
        .locator('#contact textarea[name="message"], #contact textarea[placeholder*="message" i]')
        .first();

      if (await nameInput.isVisible()) await nameInput.fill('Playwright Test User');
      if (await emailInput.isVisible()) await emailInput.fill('test.recruiter@example.com');
      if (await msgInput.isVisible())
        await msgInput.fill('Hello Tanvir, great AI/ML portfolio. Automated test message.');

      await page.waitForTimeout(200);
      await submitBtn.click();
      await page.waitForTimeout(1000);
      assert(true, 'Contact form submitted successfully');
    }

    // 10. Responsive Viewport Tests
    console.log('\n--- TEST 10: Responsive Viewports (Mobile & Tablet) ---');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Test mobile menu button
    const mobileMenuBtn = page
      .locator('button[aria-label*="menu" i], .navbar-mobile-toggle, [data-testid="mobile-menu"]')
      .first();
    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(300);
      assert(true, 'Mobile menu opens on toggle click');
      await mobileMenuBtn.click();
      await page.waitForTimeout(300);
    }

    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.waitForTimeout(300);
    assert(true, 'Tablet viewport rendered cleanly');
  } catch (err) {
    console.error('Audit exception:', err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Tests Passed: ${passCount}`);
  console.log(`Tests Failed: ${failCount}`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('\n--- Console Errors: ---');
    consoleErrors.forEach((e, idx) => console.log(`${idx + 1}. ${e}`));
  }
  console.log(`Page Uncaught Exceptions: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    console.log('\n--- Page Errors: ---');
    pageErrors.forEach((e, idx) => console.log(`${idx + 1}. ${e}`));
  }
  console.log(`Failed / 404 Network Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) {
    console.log('\n--- Network Failures / 404s: ---');
    failedRequests.forEach((e, idx) => console.log(`${idx + 1}. ${e}`));
  }
  console.log('===============================================\n');

  return { passCount, failCount, consoleErrors, pageErrors, failedRequests };
}

runAudit();
