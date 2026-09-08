import { chromium } from 'playwright';

const BASE_URL = process.env.DEV_URL || 'http://localhost:3001/';

async function runComprehensiveAudit() {
  console.log('=== STARTING COMPREHENSIVE UI/UX & BUG AUDIT ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const issues = [];
  const warnings = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      issues.push(`[Console Error] ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(`[Console Warning] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    issues.push(`[Page Uncaught Exception] ${err.message}`);
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Broken Anchor Links Check
  console.log('Checking internal anchor links...');
  const anchorHrefs = await page.$$eval('a[href^="#"]', (links) =>
    links.map((a) => a.getAttribute('href'))
  );
  for (const href of new Set(anchorHrefs)) {
    if (href === '#' || href === '#!') continue;
    const targetId = href.replace('#', '');
    const exists = await page.evaluate((id) => !!document.getElementById(id), targetId);
    if (!exists) {
      issues.push(`[Broken Anchor] Link target "${href}" does not exist in the DOM.`);
    }
  }

  // 2. Responsive Horizontal Overflow Check
  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Mobile Large (414px)', width: 414, height: 896 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1024px)', width: 1024, height: 768 },
    { name: 'Wide (1440px)', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    const overflowInfo = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const overflowingElements = [];
      if (scrollW > docW) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > docW + 1) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              right: rect.right,
              width: rect.width
            });
          }
        }
      }
      return { hasOverflow: scrollW > docW, scrollW, docW, overflowingElements: overflowingElements.slice(0, 5) };
    });

    if (overflowInfo.hasOverflow) {
      issues.push(
        `[Horizontal Overflow on ${vp.name}] scrollWidth (${overflowInfo.scrollW}px) > clientWidth (${overflowInfo.docW}px). Culprits: ${JSON.stringify(overflowInfo.overflowingElements)}`
      );
    }
  }

  // Reset to desktop
  await page.setViewportSize({ width: 1440, height: 900 });

  // 3. Theme Consistency & Contrast Audit (Dark & Light Mode)
  for (const theme of ['dark', 'light']) {
    console.log(`Checking UI in ${theme} mode...`);
    if (theme === 'light') {
      // Toggle theme
      const themeBtn = page.locator('button[aria-label*="mode" i], button[title*="mode" i]').first();
      if (await themeBtn.count() > 0) {
        await themeBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Check for unreadable low-contrast text (e.g. white on white, dark on dark)
    const lowContrastCandidates = await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.offsetParent && node.tagName !== 'BODY') continue;
        const text = node.innerText?.trim();
        if (!text || text.length > 80 || node.children.length > 2) continue;

        const style = window.getComputedStyle(node);
        const color = style.color;
        const bg = style.backgroundColor;

        // Parse rgb/rgba
        const parseRgb = (str) => {
          const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
        };

        const c = parseRgb(color);
        const b = parseRgb(bg);

        // If background is explicit on this element
        if (c && b && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
          const lum = (rgb) => 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
          const diff = Math.abs(lum(c) - lum(b));
          if (diff < 30) {
            results.push({
              text: text.slice(0, 40),
              tag: node.tagName,
              className: typeof node.className === 'string' ? node.className : '',
              color,
              bg,
              diff
            });
          }
        }
      }
      return results;
    });

    if (lowContrastCandidates.length > 0) {
      warnings.push(`[Low Contrast Candidates in ${theme} mode]: ${JSON.stringify(lowContrastCandidates.slice(0, 5))}`);
    }
  }

  // 4. Modals and Dialog Focus / Accessibility
  console.log('Checking Modals...');
  // Open Command Center via shortcut
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(400);

  const commandCenterState = await page.evaluate(() => {
    const dialog = document.querySelector('dialog[open]');
    if (!dialog) return { open: false };
    const activeEl = document.activeElement;
    return {
      open: true,
      hasAriaLabel: !!dialog.getAttribute('aria-label') || !!dialog.getAttribute('aria-labelledby'),
      focusedTag: activeEl ? activeEl.tagName : null,
      focusedPlaceholder: activeEl ? activeEl.getAttribute('placeholder') : null
    };
  });

  if (!commandCenterState.open) {
    issues.push('[Command Center] Failed to open on Ctrl+K');
  } else if (!commandCenterState.hasAriaLabel) {
    issues.push('[Command Center] Dialog missing aria-label or aria-labelledby');
  }

  // Close Command Center via ESC
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 5. Test Playground Tabs in Detail
  console.log('Checking Playground tabs...');
  const tabIds = ['3dvector', 'rag', 'dialect', 'fraud', 'vision'];
  for (const tid of tabIds) {
    const tabBtn = page.locator(`#playground-tab-${tid}`);
    if (await tabBtn.count() === 0) {
      issues.push(`[Playground Tab] Button #playground-tab-${tid} not found`);
      continue;
    }
    await tabBtn.click();
    await page.waitForTimeout(400);
    // Check if panel is rendered
    const panel = page.locator(`[role="tabpanel"], #playground-panel-${tid}, .playground-content`);
    const count = await panel.count();
    if (count === 0) {
      warnings.push(`[Playground Tab] Tab ${tid} clicked, but no corresponding panel found`);
    }
  }

  // 6. Project Filter Tabs
  console.log('Checking Project filter buttons...');
  const filterBtns = page.locator('#projects button[aria-pressed]');
  const filterCount = await filterBtns.count();
  if (filterCount === 0) {
    warnings.push('[Projects] No category filter buttons with aria-pressed found');
  }

  // 7. Check for unlabelled interactive elements
  const unlabelledInputs = await page.$$eval('input:not([type="hidden"]), textarea, select', (inputs) =>
    inputs
      .filter((el) => {
        const id = el.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        const hasTitle = el.getAttribute('title');
        return !hasLabel && !hasAria && !hasTitle;
      })
      .map((el) => ({ tag: el.tagName, type: el.type, name: el.name, placeholder: el.placeholder }))
  );

  if (unlabelledInputs.length > 0) {
    warnings.push(`[Unlabelled Form Controls]: ${JSON.stringify(unlabelledInputs)}`);
  }

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Issues Found: ${issues.length}`);
  for (const iss of issues) console.log(`  ❌ ${iss}`);
  console.log(`Warnings Found: ${warnings.length}`);
  for (const w of warnings) console.log(`  ⚠️  ${w}`);
  console.log('================================================\n');

  await browser.close();
}

runComprehensiveAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
