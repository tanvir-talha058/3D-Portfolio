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

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

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
       through. A custom property is the one exemption — that is where the
       literals are supposed to live — as is background-image, which carries
       the pointer highlight and is driven by --lit rather than by a tier. */
    if (
      /rgba\(\s*255,\s*255,\s*255/.test(line) &&
      !/^\s*--/.test(line) &&
      !/background-image/.test(line)
    ) {
      problems.push(at + '\n    raw glass value: ' + line.trim());
    }
  });
}

if (problems.length) {
  console.error('check:glass found ' + problems.length + ' raw glass values\n');
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('check:glass: every glass surface reads its tier tokens');
