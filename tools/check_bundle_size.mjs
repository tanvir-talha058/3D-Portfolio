#!/usr/bin/env node
// Fails CI if a tracked production chunk grows past its budget. Run after
// `npm run build`. Budgets carry headroom above current baselines (see
// `npm run build` output) so this only catches a real regression, not
// routine minification noise.
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST_ASSETS = path.resolve('dist/assets');

const BUDGETS_BYTES = {
  index: 420_000,
  three: 560_000,
  Playground: 60_000,
  Research: 12_000,
  Education: 12_000
};

function chunkName(filename) {
  const match = filename.match(/^([A-Za-z0-9]+)-[\w-]+\.js$/);
  return match ? match[1] : null;
}

let files;
try {
  files = await readdir(DIST_ASSETS);
} catch {
  console.error(`Could not read ${DIST_ASSETS} — run "npm run build" first.`);
  process.exit(1);
}

let failed = false;
let checked = 0;

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  const name = chunkName(file);
  if (!name || !(name in BUDGETS_BYTES)) continue;

  const { size } = await stat(path.join(DIST_ASSETS, file));
  const budget = BUDGETS_BYTES[name];
  const over = size > budget;
  if (over) failed = true;
  checked += 1;

  console.log(
    `${file}: ${(size / 1024).toFixed(1)}KB (budget ${(budget / 1024).toFixed(0)}KB)${over ? ' — OVER BUDGET' : ''}`
  );
}

if (checked === 0) {
  console.error(
    'No tracked chunks found in dist/assets — check BUDGETS_BYTES against actual output names.'
  );
  process.exit(1);
}

if (failed) {
  console.error('\nOne or more chunks exceeded their size budget.');
  process.exit(1);
}

console.log('\nAll tracked chunks within budget.');
