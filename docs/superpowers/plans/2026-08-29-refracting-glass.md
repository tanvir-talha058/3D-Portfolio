# Refracting Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every glass pane refract the world canvas behind it — clear through the middle, bending and dispersing into colour at the rims — without touching a single component's JSX.

**Architecture:** The R3F scene renders to a `WebGLRenderTarget` instead of straight to screen. A fullscreen composite pass then draws that target back through a shader that knows the screen-space rounded rectangles of up to 24 visible glass panes, displacing the world sample along the rim normal and splitting R/G/B as it goes. Panes are found by CSS selector from a tier map, so no component changes. The CSS glass stays on top of all of it and is the floor on every failure path.

**Tech Stack:** Next.js 14.2.15 (App Router), React 18.3.1, @react-three/fiber 8.17, three 0.169 (WebGL2, GLSL3), plain CSS, Node 20 for guard and unit tests, `tsx` for running TypeScript under `node --test`.

**Spec:** `docs/superpowers/specs/2026-08-29-refracting-glass-design.md`

## Global Constraints

- Palette unchanged: `--void #05060d`, `--deep #0b0d18`, `--raise #131628`, `--ridge #1c2039`, ramp `--r0 #201a44`, `--r1 #5442b5`, `--r2 #8d7bf2`, `--r3 #6fd6ee`, `--r4 #9df3e2`, `--iris #e08ad2`.
- Typefaces unchanged: Archivo (display), IBM Plex Sans (text), IBM Plex Mono (utility).
- No JSX changes in `app/page.tsx` or any section component. Panes are found by selector.
- All 16 CSS glass recipes keep their selectors and their `--lens-*` tokens. Only the three `--lens-N-blur` values change, in Task 6.
- Body text stays at or above 4.5:1 on its pane. `--faint #78839c` at 5.32:1 on `--void` is the tightest case and must not be eroded.
- `prefers-reduced-motion: reduce` and `quality === 'low'`: the composite never mounts, and the page is byte-for-byte what it is today.
- Any WebGL failure unmounts the composite and falls back to R3F's default render. The page must never be left blank.
- Responsive to 320px with no horizontal scroll.
- `npm run check:glass`, `npm run test`, `npm run lint` and `npm run build` all pass at the end of every task.
- Maximum 24 panes in flight. No per-pane draw calls.
- No DOM layout reads inside `useFrame`.

---

### Task 1: The recipe map and a guard that keeps it honest

The shader needs to know which elements are glass and at what tier. The stylesheets already know, in the form of 16 selectors that set a `--lens-N-blur`. This task writes that knowledge down in TypeScript and makes the guard script prove the two agree — in both directions — so they cannot drift.

**Files:**
- Create: `app/components/world/glass/recipes.ts`
- Modify: `scripts/check-glass.mjs` (append a second check)

**Interfaces:**
- Produces: `type Tier = 1 | 2 | 3`; `RECIPES: Record<string, Tier>`; `type TierOptics = { rim: number; strength: number; dispersion: number; spec: number }`; `OPTICS: Record<Tier, TierOptics>`. Consumed by Tasks 2, 3 and 4.

- [ ] **Step 1: Write the failing test**

Append to `scripts/check-glass.mjs`, after the existing `if (problems.length)` block is *removed* from the end and re-added below — i.e. insert this section before the final report, so both checks report together:

```js
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
```

Change the final report's wording so it covers both checks:

```js
if (problems.length) {
  console.error('check:glass found ' + problems.length + ' problems\n');
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('check:glass: tokens honoured, recipe map matches the stylesheets');
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm run check:glass`
Expected: FAIL. It cannot read `app/components/world/glass/recipes.ts` — an `ENOENT` throw is the failure. That is the point: the check is live before the thing it checks exists.

- [ ] **Step 3: Write the recipe map**

Create `app/components/world/glass/recipes.ts`:

```ts
/**
 * Which elements are glass, and how thick.
 *
 * The stylesheets already say this — sixteen recipes, each setting a
 * --lens-N-blur — but a shader cannot read a stylesheet. So the fact is
 * written twice, and `npm run check:glass` fails the build if the two
 * copies ever disagree.
 *
 * Tier is the one axis a pane varies on, exactly as in the CSS: how far it
 * floats above the world. Everything optical follows from it. A tier 3 pane
 * floats higher, so it is thicker, so it bends more.
 */

export type Tier = 1 | 2 | 3;

export const RECIPES: Record<string, Tier> = {
  /* 1 inset — chips, steps, small instrument labels. Nearly flush. */
  '.chip': 1,
  '.pipeline-step': 1,
  '.rag-label': 1,

  /* 2 raised — cards, rows, panels, the figure frames. Most of the page. */
  '.panel': 2,
  '.rowglass': 2,
  '.research-entry': 2,
  '.net': 2,
  '.attn': 2,
  '.descent': 2,
  '.rag': 2,
  '.station-legend': 2,

  /* 3 floating — topbar, sheet, buttons. Clears the page entirely. */
  '.node-label': 3,
  '.sheet': 3,
  '.glass-btn': 3,
  '.topbar': 3,
  '.boot-skip': 3,
};

/** One selector string for querySelectorAll. */
export const PANE_SELECTOR = Object.keys(RECIPES).join(', ');

export type TierOptics = {
  /** Width of the rim band, in CSS pixels. Beyond this the pane is clear. */
  rim: number;
  /** Peak displacement at the rim, as a fraction of the rim width. */
  strength: number;
  /** How far apart R and B sample, as a fraction of the displacement. */
  dispersion: number;
  /** Specular gain. Deliberately the alpha of --lens-N-spec, so the WebGL
      highlight and the CSS one are lit to the same brightness. */
  spec: number;
};

export const OPTICS: Record<Tier, TierOptics> = {
  1: { rim: 10, strength: 0.9, dispersion: 0.18, spec: 0.28 },
  2: { rim: 14, strength: 1.2, dispersion: 0.26, spec: 0.4 },
  3: { rim: 18, strength: 1.6, dispersion: 0.34, spec: 0.55 },
};

/** Tier order as flat arrays, for upload as shader uniforms. */
export const OPTICS_ARRAYS = {
  rim: [OPTICS[1].rim, OPTICS[2].rim, OPTICS[3].rim],
  strength: [OPTICS[1].strength, OPTICS[2].strength, OPTICS[3].strength],
  dispersion: [OPTICS[1].dispersion, OPTICS[2].dispersion, OPTICS[3].dispersion],
  spec: [OPTICS[1].spec, OPTICS[2].spec, OPTICS[3].spec],
};
```

- [ ] **Step 4: Run the guard to verify it passes**

Run: `npm run check:glass`
Expected: PASS — `check:glass: tokens honoured, recipe map matches the stylesheets`.

If it reports a missing or stale recipe, the map above is wrong for this repo's current CSS, not the guard. Fix the map to match what the guard reports; the guard is reading the stylesheets and the stylesheets are the truth.

- [ ] **Step 5: Confirm nothing else moved**

Run: `npm run lint && npm run build`
Expected: both pass. `recipes.ts` is not imported yet, so the build only proves it type-checks.

- [ ] **Step 6: Commit**

```bash
git add app/components/world/glass/recipes.ts scripts/check-glass.mjs
git commit -m "Write down which panes are glass, and guard the copy"
```

---

### Task 2: Pane packing, as pure functions with tests

The registry does two separable things: read the DOM, and turn what it read into two `Float32Array`s the shader can consume. The second half is pure arithmetic — culling, sorting, capping, flipping y, clamping radii — and it is where the bugs live. It goes in its own module with real tests. This task also stands up the test runner the project does not yet have.

**Files:**
- Create: `app/components/world/glass/pack.ts`
- Create: `app/components/world/glass/pack.test.ts`
- Modify: `package.json` (add `tsx` devDependency and a `test` script)

**Interfaces:**
- Consumes: `Tier`, `OPTICS` from `recipes.ts`.
- Produces: `MAX_PANES: 24`; `type PaneInput = { x, y, w, h, radius, tier, enter, response }` all `number` except `tier: Tier`; `visible(p: PaneInput, vw: number, vh: number): boolean`; `pack(panes: PaneInput[], vw: number, vh: number, dpr: number, rects: Float32Array, params: Float32Array): number`; `approach(current: number, target: number, dt: number, tau?: number): number`. Consumed by Tasks 3 and 4.

- [ ] **Step 1: Add the test runner**

In `package.json`, add to `devDependencies`:

```json
    "tsx": "4.19.1",
```

and to `scripts`:

```json
    "test": "node --import tsx --test app/components/world/glass/pack.test.ts",
```

Run: `npm install`

- [ ] **Step 2: Write the failing tests**

Create `app/components/world/glass/pack.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_PANES, approach, pack, visible, type PaneInput } from './pack';

const pane = (over: Partial<PaneInput> = {}): PaneInput => ({
  x: 100, y: 100, w: 200, h: 120, radius: 16, tier: 2, enter: 1, response: 0,
  ...over,
});

const buffers = () => ({
  rects: new Float32Array(MAX_PANES * 4),
  params: new Float32Array(MAX_PANES * 4),
});

test('a pane inside the viewport is visible', () => {
  assert.equal(visible(pane(), 1280, 800), true);
});

test('a pane scrolled far above the viewport is not', () => {
  assert.equal(visible(pane({ y: -900 }), 1280, 800), false);
});

test('a pane straddling the top edge is still visible', () => {
  assert.equal(visible(pane({ y: -60 }), 1280, 800), true);
});

test('pack flips y into GL space and scales by dpr', () => {
  const { rects, params } = buffers();
  const n = pack([pane({ x: 10, y: 20, w: 100, h: 50 })], 1000, 800, 2, rects, params);
  assert.equal(n, 1);
  assert.equal(rects[0], 20);                 // x * dpr
  assert.equal(rects[1], (800 - 20 - 50) * 2); // (vh - y - h) * dpr
  assert.equal(rects[2], 200);
  assert.equal(rects[3], 100);
});

test('pack clamps the radius to half the shorter side', () => {
  const { rects, params } = buffers();
  pack([pane({ w: 40, h: 20, radius: 999 })], 1000, 800, 1, rects, params);
  assert.equal(params[0], 10);
});

test('pack carries tier, enter and response through', () => {
  const { rects, params } = buffers();
  pack([pane({ tier: 3, enter: 0.5, response: 0.25 })], 1000, 800, 1, rects, params);
  assert.equal(params[1], 3);
  assert.equal(params[2], 0.5);
  assert.equal(params[3], 0.25);
});

test('pack drops zero-area panes', () => {
  const { rects, params } = buffers();
  assert.equal(pack([pane({ h: 0 })], 1000, 800, 1, rects, params), 0);
});

test('over the cap, pack keeps the largest panes', () => {
  const { rects, params } = buffers();
  const many: PaneInput[] = [];
  for (let i = 0; i < MAX_PANES + 6; i += 1) {
    many.push(pane({ x: 0, y: 0, w: 10 + i, h: 10 }));
  }
  const n = pack(many, 1000, 800, 1, rects, params);
  assert.equal(n, MAX_PANES);
  // Sorted by area descending, so slot 0 is the widest pane submitted.
  assert.equal(rects[2], 10 + MAX_PANES + 5);
});

test('pack never writes past the cap', () => {
  const { rects, params } = buffers();
  const many = Array.from({ length: 100 }, () => pane());
  pack(many, 1000, 800, 1, rects, params);
  assert.equal(rects.length, MAX_PANES * 4);
});

test('approach moves toward the target and converges', () => {
  let v = 0;
  for (let i = 0; i < 60; i += 1) v = approach(v, 1, 1 / 60);
  assert.ok(v > 0.97, 'reaches most of the way in a second, got ' + v);
  assert.ok(v <= 1);
});

test('approach is frame-rate independent to within a percent', () => {
  let fast = 0;
  for (let i = 0; i < 120; i += 1) fast = approach(fast, 1, 1 / 120);
  let slow = 0;
  for (let i = 0; i < 30; i += 1) slow = approach(slow, 1, 1 / 30);
  assert.ok(Math.abs(fast - slow) < 0.01, 'fast ' + fast + ' vs slow ' + slow);
});

test('approach with an equal target does not drift', () => {
  assert.equal(approach(0.4, 0.4, 1 / 60), 0.4);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './pack'`.

- [ ] **Step 4: Write the implementation**

Create `app/components/world/glass/pack.ts`:

```ts
/**
 * Turning measured DOM rectangles into something a shader can read.
 *
 * Kept apart from the DOM reading itself because this half is pure
 * arithmetic and pure arithmetic can be tested. The y flip, the radius
 * clamp and the cap are exactly the places a refraction layer goes subtly
 * wrong, and subtly wrong refraction is very hard to see and very easy to
 * assert about.
 */

import { OPTICS, type Tier } from './recipes';

/**
 * How many panes reach the shader at once.
 *
 * The shader loops over this many rounded-rect distance evaluations per
 * pixel, so it is a real cost, and it is a uniform array size so it must be
 * a compile-time constant. Twenty-four covers the densest band on this page
 * with room to spare. A pane that loses the cap keeps its CSS glass, so it
 * degrades to how the page looked yesterday rather than to nothing.
 */
export const MAX_PANES = 24;

export type PaneInput = {
  /** Viewport-relative CSS pixels, y down — i.e. getBoundingClientRect. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius in CSS pixels, before clamping. */
  radius: number;
  tier: Tier;
  /** 0..1, eased as the pane enters the viewport. */
  enter: number;
  /** 0..1, eased on hover and focus. */
  response: number;
};

/**
 * Overlaps the viewport, grown by the pane's rim.
 *
 * The margin matters: a pane one pixel off the top of the screen still has
 * a rim that bends light back into view, and culling it would pop the
 * refraction at the edge of the screen.
 */
export function visible(p: PaneInput, vw: number, vh: number): boolean {
  const m = OPTICS[p.tier].rim;
  return p.x + p.w > -m && p.y + p.h > -m && p.x < vw + m && p.y < vh + m;
}

/**
 * Writes the visible panes into the two uniform buffers.
 *
 * `rects` is (x, y, w, h) in device pixels with the origin at the bottom
 * left, because that is where gl_FragCoord's origin is. `params` is
 * (radius, tier, enter, response). Returns how many slots were filled;
 * the shader loops to that count and ignores the rest.
 */
export function pack(
  panes: PaneInput[],
  vw: number,
  vh: number,
  dpr: number,
  rects: Float32Array,
  params: Float32Array,
): number {
  const keep = panes
    .filter((p) => p.w > 0 && p.h > 0 && visible(p, vw, vh))
    .sort((a, b) => b.w * b.h - a.w * a.h)
    .slice(0, MAX_PANES);

  for (let i = 0; i < keep.length; i += 1) {
    const p = keep[i];
    const o = i * 4;
    rects[o] = p.x * dpr;
    rects[o + 1] = (vh - p.y - p.h) * dpr;
    rects[o + 2] = p.w * dpr;
    rects[o + 3] = p.h * dpr;
    params[o] = Math.min(p.radius, Math.min(p.w, p.h) / 2) * dpr;
    params[o + 1] = p.tier;
    params[o + 2] = p.enter;
    params[o + 3] = p.response;
  }

  return keep.length;
}

/**
 * Exponential ease toward a target, independent of frame rate.
 *
 * A naive `v += (target - v) * 0.1` moves twice as fast at 120fps as at
 * 60fps, which would make the glass resolve at a different speed on
 * different machines. `tau` is the time constant: about 63% of the way
 * there after tau seconds, about 97% after 3.5 tau. The default reaches a
 * pane's full refraction in roughly 320ms.
 */
export function approach(current: number, target: number, dt: number, tau = 0.09): number {
  return current + (target - current) * (1 - Math.exp(-dt / tau));
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 11 tests.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/components/world/glass/pack.ts app/components/world/glass/pack.test.ts
git commit -m "Pack measured panes into uniform buffers, with tests"
```

---

### Task 3: The pane registry

The DOM half. It finds the panes, measures them when something moves, tracks hover and focus, and hands `pack` a fresh list each frame. Its one rule: no layout reads inside the render loop. Measurement happens in a `requestAnimationFrame` coalesced from events, so a burst of scroll events costs one measurement, and the render loop only ever reads numbers already in memory.

**Files:**
- Create: `app/components/world/glass/paneRegistry.ts`

**Interfaces:**
- Consumes: `PANE_SELECTOR`, `RECIPES`, `Tier` from `recipes.ts`; `MAX_PANES`, `approach`, `pack`, `PaneInput` from `pack.ts`.
- Produces: `type Registry = { rects: Float32Array; params: Float32Array; update(dt: number, dpr: number): number; dispose(): void }` and `createRegistry(): Registry`. Consumed by Task 4.

- [ ] **Step 1: Write the registry**

Create `app/components/world/glass/paneRegistry.ts`:

```ts
'use client';

/**
 * The DOM side of the refraction layer.
 *
 * Everything here exists to keep layout reads out of the render loop. The
 * shader needs pane rectangles every frame; getBoundingClientRect forces a
 * layout; doing that for two dozen elements sixty times a second would cost
 * more than the refraction it feeds. So: events mark the registry dirty, one
 * rAF per frame at most does the measuring, and update() — which does run in
 * the render loop — only eases numbers that are already in memory.
 */

import { PANE_SELECTOR, RECIPES, type Tier } from './recipes';
import { MAX_PANES, approach, pack, type PaneInput } from './pack';

type Tracked = {
  el: Element;
  tier: Tier;
  /** Measured. */
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  /** Eased toward targets by update(). */
  enter: number;
  enterTo: number;
  response: number;
  responseTo: number;
};

export type Registry = {
  rects: Float32Array;
  params: Float32Array;
  /** Advances easing, packs, returns how many panes the shader should read. */
  update(dt: number, dpr: number): number;
  dispose(): void;
};

/** First matching selector wins; the map has no overlapping selectors. */
function tierOf(el: Element): Tier | null {
  for (const sel of Object.keys(RECIPES)) {
    if (el.matches(sel)) return RECIPES[sel];
  }
  return null;
}

/** Computed border-radius in px. Percentages and per-corner radii collapse
    to the first value, which is what every recipe on this page uses. */
function radiusOf(el: Element): number {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export function createRegistry(): Registry {
  const rects = new Float32Array(MAX_PANES * 4);
  const params = new Float32Array(MAX_PANES * 4);

  let tracked: Tracked[] = [];
  const byEl = new Map<Element, Tracked>();
  const scratch: PaneInput[] = [];

  let dirty = true;
  let queued = 0;
  let disposed = false;

  /* Collect is the expensive one — a querySelectorAll plus a computed style
     per pane — so it runs on mount and on mutation, not on scroll. */
  function collect() {
    const found = document.querySelectorAll(PANE_SELECTOR);
    const next: Tracked[] = [];
    const seen = new Set<Element>();

    found.forEach((el) => {
      const tier = tierOf(el);
      if (!tier) return;
      seen.add(el);
      const prev = byEl.get(el);
      if (prev) {
        prev.tier = tier;
        prev.radius = radiusOf(el);
        next.push(prev);
        return;
      }
      next.push({
        el,
        tier,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        radius: radiusOf(el),
        /* New panes start unrefracted and ease in, so a sheet opening
           resolves into glass rather than arriving as glass. */
        enter: 0,
        enterTo: 0,
        response: 0,
        responseTo: 0,
      });
    });

    byEl.clear();
    for (const t of next) byEl.set(t.el, t);
    for (const t of tracked) if (!seen.has(t.el)) io.unobserve(t.el);
    for (const t of next) io.observe(t.el);
    tracked = next;
    dirty = true;
  }

  function measure() {
    const vh = window.innerHeight;
    for (const t of tracked) {
      const r = t.el.getBoundingClientRect();
      t.x = r.left;
      t.y = r.top;
      t.w = r.width;
      t.h = r.height;
      /* A pane fully offscreen has no reason to hold its eased-in state:
         letting it decay means it fades back in on return, which is what
         makes long scrolls feel like the glass is forming, not blinking. */
      if (r.bottom < -vh || r.top > vh * 2) t.enterTo = 0;
    }
    dirty = false;
  }

  function schedule() {
    dirty = true;
    if (queued || disposed) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      if (!disposed) measure();
    });
  }

  /* Entering the viewport is what turns refraction on. IntersectionObserver
     rather than a rect comparison, because it does not force layout. */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const t = byEl.get(e.target);
        if (t) t.enterTo = e.isIntersecting ? 1 : 0;
      }
      schedule();
    },
    { rootMargin: '10% 0px' },
  );

  /* Hover and focus are delegated at the document, so panes that mount
     later — the sheet, the node labels — need no wiring of their own. */
  function setResponse(target: EventTarget | null, on: boolean) {
    if (!(target instanceof Element)) return;
    const pane = target.closest(PANE_SELECTOR);
    if (!pane) return;
    const t = byEl.get(pane);
    /* Tier 1 does not respond. Chips and steps are small, plentiful and not
       interactive; lighting them under the pointer reads as noise. The CSS
       makes the same distinction with --lit. */
    if (t && t.tier > 1) t.responseTo = on ? 1 : 0;
  }

  const onOver = (e: Event) => setResponse(e.target, true);
  const onOut = (e: Event) => setResponse(e.target, false);
  const onFocusIn = (e: Event) => setResponse(e.target, true);
  const onFocusOut = (e: Event) => setResponse(e.target, false);

  const mo = new MutationObserver(() => collect());

  collect();
  measure();

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  mo.observe(document.body, { childList: true, subtree: true });

  const ro = new ResizeObserver(schedule);
  ro.observe(document.documentElement);

  return {
    rects,
    params,

    update(dt, dpr) {
      if (dirty && !queued) measure();

      scratch.length = 0;
      for (const t of tracked) {
        t.enter = approach(t.enter, t.enterTo, dt);
        t.response = approach(t.response, t.responseTo, dt, 0.12);
        /* Below a whisker of refraction a pane contributes nothing but a
           distance evaluation, so it does not get a slot. */
        if (t.enter < 0.01) continue;
        scratch.push({
          x: t.x,
          y: t.y,
          w: t.w,
          h: t.h,
          radius: t.radius,
          tier: t.tier,
          enter: t.enter,
          response: t.response,
        });
      }

      return pack(scratch, window.innerWidth, window.innerHeight, dpr, rects, params);
    },

    dispose() {
      disposed = true;
      if (queued) cancelAnimationFrame(queued);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      tracked = [];
      byEl.clear();
    },
  };
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run lint && npm run build`
Expected: both pass. The registry is not imported yet, so this proves types only.

If the build objects that `io` is used in `collect()` before its `const` declaration, move the `const io = new IntersectionObserver(...)` block above `collect()`. It is a `const` in the same closure and TypeScript is right to complain about the order.

- [ ] **Step 3: Run the existing checks**

Run: `npm test && npm run check:glass`
Expected: both pass, unchanged from Task 2.

- [ ] **Step 4: Commit**

```bash
git add app/components/world/glass/paneRegistry.ts
git commit -m "Track glass panes in the DOM without reading layout in the loop"
```

---

### Task 4: The refraction shader

The optics. One fullscreen fragment program: find the nearest pane, work out how thick the glass is at this pixel, bend the world sample along the surface normal, split the channels, add a specular. Everything outside a pane passes through untouched.

**Files:**
- Create: `app/components/world/glass/glassMaterial.ts`

**Interfaces:**
- Consumes: `MAX_PANES` from `pack.ts`; `OPTICS_ARRAYS` from `recipes.ts`.
- Produces: `createGlassMaterial(): THREE.RawShaderMaterial` whose uniforms are `tWorld` (`THREE.Texture | null`), `uRes` (`THREE.Vector2`, device px), `uCount` (`number`), `uRect` (`Float32Array`, `MAX_PANES * 4`), `uParam` (`Float32Array`, `MAX_PANES * 4`), `uTint` (`THREE.Color`), `uRimScale` (`number`), `uDispScale` (`number`). Consumed by Task 5.

- [ ] **Step 1: Write the material**

Create `app/components/world/glass/glassMaterial.ts`:

```ts
import * as THREE from 'three';
import { MAX_PANES } from './pack';
import { OPTICS_ARRAYS } from './recipes';

/**
 * The glass itself.
 *
 * CSS can blur what is behind a pane. It cannot bend it, and bending is the
 * whole difference between glass and frosting. So the world is rendered to a
 * texture and this pass draws it back, displacing the sample wherever a pane
 * covers it.
 *
 * The displacement is concentrated at the rims and near zero across the
 * middle. That is not a compromise for legibility, though it helps it — it is
 * what a thick pane with a rounded edge actually does. A flat interior barely
 * deviates a ray; a curved rim deviates it hard, and deviates red less than
 * blue, which is why the edges of real glass fringe into colour.
 */

const vertex = /* glsl */ `
precision highp float;
in vec3 position;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform sampler2D tWorld;
uniform vec2 uRes;
uniform int uCount;
uniform vec4 uRect[${MAX_PANES}];
uniform vec4 uParam[${MAX_PANES}];
uniform vec3 uTint;
uniform float uRimScale;
uniform float uDispScale;

out vec4 fragColor;

const float RIM[3]  = float[3](${OPTICS_ARRAYS.rim.map((n) => n.toFixed(1)).join(', ')});
const float STR[3]  = float[3](${OPTICS_ARRAYS.strength.map((n) => n.toFixed(3)).join(', ')});
const float DISP[3] = float[3](${OPTICS_ARRAYS.dispersion.map((n) => n.toFixed(3)).join(', ')});
const float SPEC[3] = float[3](${OPTICS_ARRAYS.spec.map((n) => n.toFixed(3)).join(', ')});

/* Negative inside, zero on the edge, positive outside.
   `hs` is the half-size. Not `half` — that is a reserved word in ESSL 3.0
   and naming a parameter with it fails to compile on some drivers and not
   others, which is the worst kind of bug to find later. */
float sdRoundRect(vec2 p, vec2 hs, float r) {
  vec2 q = abs(p) - (hs - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  vec4 base = texture(tWorld, uv);

  /* Nearest pane wins. Panes on this page do not overlap at the same tier,
     and where tiers do overlap — a button on a panel — the nearer surface
     is the one you would see the refraction of anyway. */
  float best = 1e9;
  int hit = -1;
  vec2 bestP = vec2(0.0);
  vec2 bestHs = vec2(0.0);
  float bestR = 0.0;

  for (int i = 0; i < ${MAX_PANES}; i++) {
    if (i >= uCount) break;
    vec4 R = uRect[i];
    vec2 hs = R.zw * 0.5;
    vec2 p = frag - (R.xy + hs);
    float r = min(uParam[i].x, min(hs.x, hs.y));
    float d = sdRoundRect(p, hs, r);
    if (d < best) {
      best = d;
      hit = i;
      bestP = p;
      bestHs = hs;
      bestR = r;
    }
  }

  if (hit < 0 || best > 0.0) {
    fragColor = base;
    return;
  }

  /* Clamped, not trusted. Indexing a const array out of range in GLSL is
     undefined rather than an error, and undefined here means a driver-
     dependent garbage rim width. */
  int tier = clamp(int(uParam[hit].y) - 1, 0, 2);
  float enter = uParam[hit].z;
  float resp = uParam[hit].w;

  /* A responding pane thickens slightly: hovering a card should feel like
     leaning on the glass, not like switching a light on. */
  float rim = RIM[tier] * uRimScale * (1.0 + 0.25 * resp);
  float depth = -best;

  /* 1 at the rim, 0 by the time we are `rim` pixels in. Squared so the
     falloff is optical rather than linear, and scaled by enter so a pane
     resolves into glass instead of appearing as glass. */
  float t = 1.0 - smoothstep(0.0, rim, depth);
  t = t * t * enter;

  if (t < 0.002) {
    fragColor = base;
    return;
  }

  /* Outward normal of the rounded rect, analytically. Sampling the SDF for
     a gradient goes wrong at small radii, where the corners of a chip are
     only a few pixels across and a one-pixel step spans the whole curve. */
  vec2 s = sign(bestP);
  vec2 q = abs(bestP) - (bestHs - bestR);
  vec2 g = (q.x > 0.0 && q.y > 0.0)
    ? normalize(max(q, vec2(1e-4)))
    : (q.x > q.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
  vec2 n = normalize(g * s);

  vec2 off = n * t * (STR[tier] * rim) / uRes;
  float disp = DISP[tier] * uDispScale;

  vec4 mid = texture(tWorld, uv + off);
  vec3 col = vec3(
    texture(tWorld, uv + off * (1.0 + disp)).r,
    mid.g,
    texture(tWorld, uv + off * (1.0 - disp)).b
  );

  /* The station tint already warms every pane's CSS fill. Warming the
     refraction by the same colour is what keeps the two reading as one
     material rather than as a filter over a filter. */
  col = mix(col, col * uTint * 1.15, 0.25 * t);

  /* Lit from the upper left, which is the direction --lens-N-edge-hi
     lights. gl_FragCoord has y up, so up-left is (-x, +y). */
  vec3 L = normalize(vec3(-0.55, 0.6, 0.58));
  float spec = pow(max(dot(normalize(vec3(n, 0.85)), L), 0.0), 22.0)
    * SPEC[tier] * t * (1.0 + 0.6 * resp);

  /* The specular has to raise alpha too. The world canvas is transparent
     over the page background, and a highlight that only wrote colour would
     be invisible everywhere the world is empty — which is most of a pane. */
  fragColor = vec4(col + spec, max(mid.a, spec));
}
`;

export function createGlassMaterial(): THREE.RawShaderMaterial {
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tWorld: { value: null as THREE.Texture | null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uCount: { value: 0 },
      uRect: { value: new Float32Array(MAX_PANES * 4) },
      uParam: { value: new Float32Array(MAX_PANES * 4) },
      uTint: { value: new THREE.Color('#5442b5') },
      uRimScale: { value: 1 },
      uDispScale: { value: 1 },
    },
  });
}
```

- [ ] **Step 2: Verify it compiles as TypeScript**

Run: `npm run lint && npm run build`
Expected: both pass. This does not compile the GLSL — only Task 5 running in a browser does that.

- [ ] **Step 3: Run the other checks**

Run: `npm test && npm run check:glass`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add app/components/world/glass/glassMaterial.ts
git commit -m "Bend the world at the rim of every pane"
```

---

### Task 5: Take over the frame

Wiring. The composite component allocates the render target, owns the render loop, drives the registry and the uniforms, and — the part that matters most — gets out of the way completely if anything about it fails.

**Files:**
- Create: `app/components/world/glass/GlassComposite.tsx`
- Modify: `app/components/world/World.tsx`

**Interfaces:**
- Consumes: `createRegistry` from `paneRegistry.ts`; `createGlassMaterial` from `glassMaterial.ts`.
- Produces: default export `GlassComposite({ onFail }: { onFail: () => void })`.

- [ ] **Step 1: Write the composite**

Create `app/components/world/glass/GlassComposite.tsx`:

```tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassMaterial } from './glassMaterial';
import { createRegistry } from './paneRegistry';

/**
 * Owns the frame.
 *
 * A useFrame with a non-zero priority turns off R3F's automatic render, which
 * means this component is now responsible for drawing the scene at all. That
 * is a real obligation: every early return below still renders the world, and
 * the failure path unmounts the component so R3F takes its render back. A
 * refraction bug must never be able to blank the page.
 *
 * CameraRig stays at priority 0, so it has already moved the camera by the
 * time we draw.
 */

type Props = { onFail: () => void };

/** The station tint, read from the CSS custom property that already drives
    every pane's fill, so the shader cannot disagree with the stylesheet. */
function readTint(target: THREE.Color) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--glass-tint')
    .trim();
  if (!raw) return;
  try {
    target.set(raw);
  } catch {
    /* Mid-transition the property can read as a non-parsable interpolation.
       Keeping the previous colour for a frame is invisible. */
  }
}

export default function GlassComposite({ onFail }: Props) {
  const { gl, scene, camera, size, viewport } = useThree();
  const failed = useRef(false);

  const material = useMemo(() => createGlassMaterial(), []);
  const registry = useMemo(() => createRegistry(), []);

  const quad = useMemo(() => {
    const s = new THREE.Scene();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    m.frustumCulled = false;
    s.add(m);
    return { scene: s, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [material]);

  const target = useMemo(
    () =>
      new THREE.WebGLRenderTarget(1, 1, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
      }),
    [],
  );

  /* WebGL1 has no GLSL3, no texture() and no const array initialisers. Rather
     than keep a second shader for it, we decline: the page already looks
     right without refraction. */
  useEffect(() => {
    if (!gl.capabilities.isWebGL2) {
      failed.current = true;
      onFail();
    }
  }, [gl, onFail]);

  useEffect(() => {
    const w = Math.max(1, Math.floor(size.width * viewport.dpr));
    const h = Math.max(1, Math.floor(size.height * viewport.dpr));
    target.setSize(w, h);
    material.uniforms.uRes.value.set(w, h);
    /* Below the page's own breakpoint a full rim is most of a small pane, so
       it would read as a smear rather than an edge. */
    const small = size.width < 900;
    material.uniforms.uRimScale.value = small ? 0.6 : 1;
    material.uniforms.uDispScale.value = small ? 0.5 : 1;
  }, [size, viewport.dpr, target, material]);

  /* The tint changes on the root's data-frame, which WorldMount writes. */
  useEffect(() => {
    const tint = material.uniforms.uTint.value as THREE.Color;
    readTint(tint);
    const mo = new MutationObserver(() => {
      /* The CSS transition on --glass-tint runs 1.4s, so sample across it
         rather than once at the start. */
      let n = 0;
      const id = setInterval(() => {
        readTint(tint);
        n += 1;
        if (n > 28) clearInterval(id);
      }, 50);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-frame'] });
    return () => mo.disconnect();
  }, [material]);

  useEffect(
    () => () => {
      registry.dispose();
      target.dispose();
      material.dispose();
      quad.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    },
    [registry, target, material, quad],
  );

  useFrame((_, dt) => {
    if (failed.current) return;

    let count = 0;
    try {
      count = registry.update(Math.min(dt, 0.1), viewport.dpr);
    } catch {
      failed.current = true;
      onFail();
      return;
    }

    /* No glass on screen: the composite would be a fullscreen pass that
       changes nothing. Draw the world straight out instead. */
    if (count === 0) {
      gl.setRenderTarget(null);
      gl.render(scene, camera);
      return;
    }

    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    material.uniforms.tWorld.value = target.texture;
    material.uniforms.uCount.value = count;
    (material.uniforms.uRect.value as Float32Array).set(registry.rects);
    (material.uniforms.uParam.value as Float32Array).set(registry.params);
    material.uniformsNeedUpdate = true;

    gl.clear();
    gl.render(quad.scene, quad.camera);
  }, 1);

  return null;
}
```

- [ ] **Step 2: Mount it from the world**

In `app/components/world/World.tsx`, add the imports beside the existing ones:

```tsx
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GlassComposite = dynamic(() => import('./glass/GlassComposite'), { ssr: false });
```

Note the existing file already imports `useState` from `'react'`; extend that import rather than adding a second one.

Inside the component, above the `return`, add:

```tsx
  /* Refraction is an enhancement, and enhancements are the first thing to
     go: not on the low tier, not under reduced motion, and not once it has
     told us it cannot run. The CSS glass is the floor in all three cases. */
  const [glassOk, setGlassOk] = useState(true);
  const wantGlass = glassOk && !low && !reduced;
```

and inside `<Canvas>`, immediately after `<CameraRig … />`:

```tsx
      {wantGlass ? <GlassComposite onFail={() => setGlassOk(false)} /> : null}
```

- [ ] **Step 3: Build and check**

Run: `npm run build && npm run lint && npm test && npm run check:glass`
Expected: all four pass.

- [ ] **Step 4: Look at it**

Run: `npm run dev`, open `http://localhost:3000`.

Expected: the page renders as before, and the rims of panes over the hero field and the network station now bend and fringe the particles behind them. The console must be free of GLSL compile errors — a compile failure in three prints the whole shader source with a caret, so it is unmissable.

If the page is blank, the composite has taken the frame and not given it back: check that `gl.setRenderTarget(null)` runs on every path in `useFrame`, including both early returns.

- [ ] **Step 5: Commit**

```bash
git add app/components/world/glass/GlassComposite.tsx app/components/world/World.tsx
git commit -m "Render the world through the glass"
```

---

### Task 6: Let the refraction through the blur

The refraction is behind the pane's own `backdrop-filter`, and at 16/24/32px of blur the panes soften it back into frosting. This task spends blur to buy bending. It is a token change, so it moves all 16 recipes at once and none of them individually.

**Files:**
- Modify: `app/globals.css:73,86,99` (the three `--lens-N-blur` values)

**Interfaces:**
- Consumes: nothing. Produces: nothing. Purely a tuning task.

- [ ] **Step 1: Lower the three blur tokens**

In `app/globals.css`, change only these three declarations, leaving every other token untouched:

```css
  --lens-1-blur:    11px;
```
```css
  --lens-2-blur:    16px;
```
```css
  --lens-3-blur:    22px;
```

They were 16px, 24px and 32px. Roughly a third comes off each, so the tiers stay in the same proportion to one another — a pane still differs from a pane at another tier along the one axis it always did.

Add this note directly above the `--lens-1-blur` line, inside the existing comment block that documents the tier system, as its own paragraph:

```css
     These blurs are lower than a pure CSS design would want. The world
     behind each pane is refracted before the pane blurs it, and blur is
     exactly the operation that undoes refraction: at 32px the rim
     dispersion smears back into a grey haze. The tiers keep their
     proportions; they just start lower.
```

- [ ] **Step 2: Verify the guard still passes**

Run: `npm run check:glass`
Expected: PASS. The values are still literals inside `:root` custom properties, which is where the guard has always permitted them.

- [ ] **Step 3: Check the contrast floor**

Open `http://localhost:3000` and inspect `.panel` body copy and any `--faint` utility text over a station. Sample the rendered text and background with the browser's contrast tool.

Expected: body copy at or above 4.5:1 on its pane; `--faint` no worse than the 5.32:1 it has on `--void`.

If a value has slipped below its floor, the fix is `--lens-N-fill-a` — raise the tint fraction by a percentage point, which lifts the pane's own opacity and takes the world's energy back out of the text's backdrop. Do not fix it by raising the blur; that just undoes this task.

- [ ] **Step 4: Full verification**

Run: `npm run build && npm run lint && npm test && npm run check:glass`
Expected: all four pass.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "Spend blur to buy bending"
```

---

## Author verification

The agent's browser is on a different host and cannot reach the dev server, so these are yours to run against `npm run dev`.

1. **Refraction reads.** Scroll to the expertise band. Where `.net`'s frame covers the network station, the rim bends the lines behind it and fringes them into colour. The middle of the pane stays clear enough to read.
2. **Tiers still agree.** `.panel` beside `.research-entry`: same depth, same temperature. `.topbar` beside `.glass-btn`: likewise, and both bend more than the tier 2 pair.
3. **Tint follows.** Scroll all five stations. The refraction warms and cools with the fill — violet, periwinkle, cyan, aqua, magenta — and never lags it by more than the 1.4s transition.
4. **Response is selective.** Hover a card: the rim brightens and thickens over about a tenth of a second. Hover a chip: nothing, by design.
5. **Entry eases.** Scroll a fresh band into view. Panes resolve into glass over roughly a third of a second rather than arriving finished.
6. **Reduced motion.** Turn it on. The page is indistinguishable from before this work: no refraction, no easing, CSS glass only.
7. **Low tier.** Throttle to 4 cores in devtools and reload, or open at under 900px wide. Same: no composite, CSS glass only.
8. **320px.** No horizontal scroll. Rims are narrow, dispersion halved, text readable.
9. **Failure path.** In devtools, block WebGL2 (or force `webgl1`) and reload. The fallback rings render, the CSS glass is intact, and nothing is blank.
10. **Frame rate.** Record a performance profile scrolling the densest band. The composite should not push a mid-range laptop below 55fps. If it does, the levers in order are `MAX_PANES`, then `OPTICS[*].rim`, then sampling the world at half resolution.
