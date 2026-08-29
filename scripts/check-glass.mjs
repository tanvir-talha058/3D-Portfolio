/**
 * Every glass surface on this page must read its tier's tokens.
 *
 * The page had sixteen glass recipes and no two agreed: blur ran from 14px
 * to 40px, saturate from 160% to 185%, and six of them bypassed the tokens
 * that already existed. Panes that should have read as the same material sat
 * at visibly different depths. This guard is what keeps that from coming
 * back — a raw value in a glass declaration fails the build.
 */

import { readFileSync } from 'node:fs';

const FILES = ['app/globals.css', 'app/sections.css', 'app/motion.css'];

/* Effects that are deliberately not panes of glass. .cursor-ring inverts
   rather than blurs, .sheet-backdrop is a scrim over the whole viewport,
   and .mobile-nav is opaque on purpose (sections.css documents why). */
const EXEMPT = ['cursor-ring', 'sheet-backdrop', 'mobile-nav'];

/* Blank the comments out rather than deleting them. Deleting shifts every
   line after a block comment, and this file's whole job is to report a line
   number you can jump to. */
const strip = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const problems = [];

for (const file of FILES) {
  const lines = strip(readFileSync(file, 'utf8')).split('\n');
  let selector = '';

  lines.forEach((line, i) => {
    const open = line.match(/^([^{}]+)\{\s*$/);
    if (open) selector = open[1].trim();
    if (EXEMPT.some((e) => selector.includes(e))) return;

    const at = file + ':' + (i + 1) + '  ' + selector;

    if (/backdrop-filter/.test(line) && /\d+px|\d+%/.test(line)) {
      problems.push(at + '\n    raw blur/saturate: ' + line.trim());
    }

    /* Any white on a pane, wherever it appears. Checking whole declarations
       is not enough: a multi-line box-shadow puts each inset on its own
       line, and the first version of this guard let every one of them
       through.

       Three exemptions. A custom property is where the literals are
       supposed to live. background-image carries the pointer highlight,
       which layers over a tier rather than being one. And anything driven
       by --lit is that same highlight: its alpha is a function of how close
       the pointer is, so it cannot be a fixed token. */
    if (
      /rgba\(\s*255,\s*255,\s*255/.test(line) &&
      !/^\s*--/.test(line) &&
      !/background-image/.test(line) &&
      !/var\(--lit/.test(line)
    ) {
      problems.push(at + '\n    raw glass value: ' + line.trim());
    }
  });
}

/* ------------------------------------------------------------------
   Second invariant: the tier map the shader reads must list exactly
   the selectors the stylesheets style, at the same tier.

   The refraction layer finds panes with querySelectorAll over a map in
   recipes.ts. That map is a second copy of a fact the CSS already
   states, and a second copy that nobody checks is a second copy that
   goes stale. So we check it: a pane styled as tier 2 that the map
   calls tier 3 would refract at the wrong thickness, and a recipe
   missing from the map would not refract at all, silently.
   ------------------------------------------------------------------ */

const RECIPE_FILE = 'app/components/world/glass/recipes.ts';

/** Selector -> tier, as the stylesheets declare it. */
const fromCss = new Map();

for (const file of FILES) {
  const lines = strip(readFileSync(file, 'utf8')).split('\n');
  let selector = '';
  lines.forEach((line) => {
    const open = line.match(/^([^{}]+)\{\s*$/);
    if (open) selector = open[1].trim();
    const m = line.match(/--lens-([123])-blur/);
    // :root declares the tokens; it is not a pane.
    if (m && !selector.startsWith(':root') && !/^\s*--lens/.test(line)) {
      fromCss.set(selector, Number(m[1]));
    }
  });
}

/** Selector -> tier, as recipes.ts declares it. Read with a regex rather
    than an import: this is a plain Node script and recipes.ts is TS. */
const fromMap = new Map();
const src = readFileSync(RECIPE_FILE, 'utf8');
const body = src.slice(src.indexOf('RECIPES'));
for (const m of body.matchAll(/'([.#][\w-]+)'\s*:\s*([123])/g)) {
  fromMap.set(m[1], Number(m[2]));
}

for (const [sel, tier] of fromCss) {
  if (!fromMap.has(sel)) {
    problems.push(RECIPE_FILE + '\n    missing recipe: ' + sel + ' is tier ' + tier + ' in CSS');
  } else if (fromMap.get(sel) !== tier) {
    problems.push(
      RECIPE_FILE + '\n    tier mismatch: ' + sel +
      ' is ' + tier + ' in CSS, ' + fromMap.get(sel) + ' in the map'
    );
  }
}
for (const [sel] of fromMap) {
  if (!fromCss.has(sel)) {
    problems.push(RECIPE_FILE + '\n    stale recipe: ' + sel + ' is in the map but styles no glass');
  }
}

if (problems.length) {
  console.error('check:glass found ' + problems.length + ' problems\n');
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('check:glass: tokens honoured, recipe map matches the stylesheets');
