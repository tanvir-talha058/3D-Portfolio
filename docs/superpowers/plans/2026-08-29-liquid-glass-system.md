# Liquid Glass System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every glass surface on the page one material, driven by a three-tier elevation token scale, so no surface invents its own blur.

**Architecture:** Add three complete tiers of `--lens-*` tokens to `globals.css`. Rewrite each of the 16 existing glass recipes to read its tier's tokens instead of hardcoded values, keeping every existing selector so there are no JSX changes and no pseudo-element collisions. Edge lensing comes from directional `inset` box-shadows rather than a gradient-border pseudo-element, because eight of these surfaces already own a `::before` or `::after`. A Node guard script enforces the invariant.

**Tech Stack:** Next.js 14.2.15 (App Router), plain CSS (Tailwind is present but unused for these surfaces), Node 20 for the guard script.

**Spec:** `docs/superpowers/specs/2026-08-29-liquid-glass-system-design.md`

## Global Constraints

- Palette unchanged: `--void #05060d`, `--deep #0b0d18`, `--raise #131628`, `--ridge #1c2039`, ramp `--r0 #201a44`, `--r1 #5442b5`, `--r2 #8d7bf2`, `--r3 #6fd6ee`, `--r4 #9df3e2`, `--iris #e08ad2`.
- Typefaces unchanged: Archivo (display, `wdth` axis), IBM Plex Sans (text), IBM Plex Mono (utility).
- Page structure unchanged: nine bands, left rail, one world canvas.
- Body text stays at or above 4.5:1 on its pane. `--faint #78839c` is the tightest at 5.32:1 on `--void` and must not be eroded by the tint.
- `prefers-reduced-motion: reduce` drops tint transitions and the pointer highlight.
- Responsive to 320px with no horizontal scroll.
- Every value in a `backdrop-filter`, glass fill, glass edge, or glass specular must be a `--lens-*` token. The guard script is the enforcement.

---

### Task 1: Tier tokens and the guard script

**Files:**
- Modify: `app/globals.css:41-47` (replace the four `--glass-*` surface tokens)
- Create: `scripts/check-glass.mjs`
- Modify: `package.json` scripts block (add `check:glass`)

**Interfaces:**
- Produces: tokens `--lens-{1,2,3}-{blur,sat,fill-a,fill-b,edge,edge-hi,edge-lo,spec,shadow}`, consumed by Tasks 2, 3 and 4. Script `npm run check:glass` exits non-zero on any raw glass value; it is the test in Tasks 2, 3, 4 and 5.

- [ ] **Step 1: Write the failing test**

Create `scripts/check-glass.mjs`. It reads the three CSS files, strips comments, and fails on any `backdrop-filter` whose arguments are literals rather than tokens, and on any `rgba(255, 255, 255, ...)` used as a glass fill, edge or inner specular.

```js
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
    if (/^\s*(background|border|box-shadow)\s*:/.test(line) &&
        /rgba\(255,\s*255,\s*255/.test(line)) {
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
```

- [ ] **Step 2: Run it to make sure it fails**

Add to the `scripts` block in `package.json`:

```json
    "check:glass": "node scripts/check-glass.mjs",
```

Run: `npm run check:glass`
Expected: FAIL, listing roughly 30 raw values across `.chip`, `.node-label`, `.sheet`, `.glass-btn`, `.topbar`, `.rowglass`, `.pipeline-step`, `.tile`, `.net`, `.attn`, `.attn-head`, `.descent`, `.rag`, `.rag-label`, `.station-legend`, `.boot-skip`, `.research-entry` and `.sheet-arch li`.

- [ ] **Step 3: Add the tier tokens**

In `app/globals.css`, replace the `Apple-glass surface system` block (lines 41-47) with:

```css
  /* ---------------------------------------------------------------
     Glass, as one material at three elevations. A pane differs from
     another pane along exactly one axis: how far it floats above the
     world canvas. Every property below moves monotonically across the
     three tiers, which is what makes panes at the same tier read as
     the same depth and the same temperature.

     1 inset    - chips, tiles, small instrument labels. Nearly flush.
     2 raised   - cards, rows, panels. The default; most of the page.
     3 floating - topbar, sheet, buttons. Clears the page entirely.

     edge-hi and edge-lo light the border directionally: the top-left
     of a pane catches the light and the bottom-right falls away. That
     is the lensing, and it is done with inset shadows rather than a
     gradient border because eight of these surfaces already own a
     ::before or ::after of their own.
     --------------------------------------------------------------- */
  --lens-1-blur:    16px;
  --lens-1-sat:     165%;
  --lens-1-fill-a:  rgba(255, 255, 255, 0.045);
  --lens-1-fill-b:  rgba(255, 255, 255, 0.015);
  --lens-1-edge:    rgba(190, 215, 255, 0.14);
  --lens-1-edge-hi: rgba(255, 255, 255, 0.16);
  --lens-1-edge-lo: rgba(255, 255, 255, 0.04);
  --lens-1-spec:    rgba(255, 255, 255, 0.28);
  --lens-1-shadow:  0 6px 18px -10px rgba(0, 0, 0, 0.75);

  --lens-2-blur:    24px;
  --lens-2-sat:     175%;
  --lens-2-fill-a:  rgba(255, 255, 255, 0.055);
  --lens-2-fill-b:  rgba(255, 255, 255, 0.015);
  --lens-2-edge:    rgba(190, 215, 255, 0.20);
  --lens-2-edge-hi: rgba(255, 255, 255, 0.24);
  --lens-2-edge-lo: rgba(255, 255, 255, 0.06);
  --lens-2-spec:    rgba(255, 255, 255, 0.40);
  --lens-2-shadow:  0 16px 50px -18px rgba(0, 0, 0, 0.85);

  --lens-3-blur:    32px;
  --lens-3-sat:     185%;
  --lens-3-fill-a:  rgba(255, 255, 255, 0.075);
  --lens-3-fill-b:  rgba(255, 255, 255, 0.020);
  --lens-3-edge:    rgba(190, 215, 255, 0.28);
  --lens-3-edge-hi: rgba(255, 255, 255, 0.34);
  --lens-3-edge-lo: rgba(255, 255, 255, 0.08);
  --lens-3-spec:    rgba(255, 255, 255, 0.55);
  --lens-3-shadow:  0 24px 64px -22px rgba(0, 0, 0, 0.92);
```

These are custom-property definitions, not `background`/`border`/`box-shadow` declarations, so the guard's second rule does not match them.

- [ ] **Step 4: Run the guard to confirm it still fails, and not on the tokens**

Run: `npm run check:glass`
Expected: still FAIL, and no reported line is inside `:root`. If `:root` appears, the regex in Step 1 lost its `\s*:` anchor — restore it and re-run.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-glass.mjs package.json app/globals.css
git commit -m "Add the glass tier tokens and a guard that enforces them"
```

---

### Task 2: Migrate the globals.css surfaces

**Files:**
- Modify: `app/globals.css` — `.panel` (250), `.chip` (~310), `.node-label` (~365), `.sheet` (~430), `.glass-btn` (~470), `.topbar` (~516), `.rowglass` (~572), and the mobile block (~593)

**Interfaces:**
- Consumes: `--lens-*` tokens from Task 1.
- Produces: nothing new. Selectors and class names are unchanged, so no JSX moves.

Tier assignment for this file:

| Selector | Tier | Was |
|---|---|---|
| `.panel` | 2 | 28px / 180% |
| `.rowglass` | 2 | 22px / 170% |
| `.chip` | 1 | 14px / 160% |
| `.node-label` | 3 | 20px / 180% |
| `.glass-btn` | 3 | 24px / 180% |
| `.topbar` | 3 | 26px / 180% |
| `.sheet` | 3 | 40px / 180% |

`.sheet` drops from 40px to the tier's 32px. That is the point of the change: it was the outlier.

- [ ] **Step 1: Rewrite `.panel` onto tier 2**

```css
.panel {
  position: relative;
  isolation: isolate;
  border-radius: var(--r-md);
  background: linear-gradient(160deg, var(--lens-2-fill-a), var(--lens-2-fill-b));
  backdrop-filter: blur(var(--lens-2-blur)) saturate(var(--lens-2-sat));
  -webkit-backdrop-filter: blur(var(--lens-2-blur)) saturate(var(--lens-2-sat));
  border: 1px solid var(--lens-2-edge);
  box-shadow:
    var(--lens-2-shadow),
    inset 0 1px 0 0 var(--lens-2-spec),
    inset 1px 0 0 0 var(--lens-2-edge-hi),
    inset -1px 0 0 0 var(--lens-2-edge-lo),
    inset 0 -1px 0 0 var(--lens-2-edge-lo);
}
```

Leave `.panel::after`, `.panel-lg` and `.panel-sm` exactly as they are.

- [ ] **Step 2: Rewrite the remaining six**

Apply the same shape to each, swapping the tier number per the table above. For each rule: `background` becomes the tier's two-stop gradient, `backdrop-filter` and its `-webkit-` twin read the tier's blur and saturate, `border` reads the tier's edge, and `box-shadow` becomes the tier shadow plus the four inset lines shown in Step 1.

Keep every non-glass declaration untouched — `.topbar`'s `position`, `z-index` and grid, `.glass-btn`'s padding and `transition`, `.chip`'s `border-radius: 999px`, `.sheet`'s `width`, `overflow` and `animation`.

Two rules keep their own colour and only lose their glass values:
- `.topbar[data-stuck='true']` keeps its `rgba(14, 16, 23, 0.62)` fill — that is a state, not a tier — but its `inset 0 1px 0` reads `var(--lens-3-spec)`.
- `.glass-btn--hot` keeps its `--r4`/`--r3` gradient; only its `inset 0 1px 0` moves to `var(--lens-3-spec)`.

- [ ] **Step 3: Update the mobile blur budget**

Replace the `@media (max-width: 640px)` block at ~593:

```css
/* Backdrop-filter is a real cost on large panes, and more so over a live
   WebGL canvas. On small screens the scene is simplified anyway, so every
   tier trades blur for fill. Tier 1 loses it outright: those surfaces
   appear in walls of twenty or more and are the cheapest to make opaque. */
@media (max-width: 640px) {
  :root {
    --lens-1-blur: 0px;
    --lens-1-fill-a: rgba(255, 255, 255, 0.07);
    --lens-2-blur: 14px;
    --lens-3-blur: 20px;
  }
}
```

- [ ] **Step 4: Run the guard**

Run: `npm run check:glass`
Expected: still FAIL, but every remaining problem is in `app/sections.css` or `app/motion.css`. No `app/globals.css` line remains.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "Move the globals surfaces onto the glass tiers"
```

---

### Task 3: Migrate sections.css and motion.css

**Files:**
- Modify: `app/sections.css` — `.pipeline-step` (440), `.research-entry` (602), `.tile` (713), `.sheet-arch li` (927), `.net` (1159), `.attn` (1309), `.attn-head` (1395), `.descent` (1444), `.rag` (1506), `.rag-label` (1581), `.station-legend` (1667)
- Modify: `app/motion.css` — `.boot-skip` (343)

**Interfaces:**
- Consumes: `--lens-*` tokens from Task 1.

Tier assignment:

| Selector | Tier | Was |
|---|---|---|
| `.net`, `.attn`, `.descent`, `.rag` | 2 | 24px / 170% |
| `.research-entry` | 2 | **no blur at all** |
| `.station-legend` | 2 | 20px / 160% |
| `.pipeline-step` | 1 | 18px / 160% |
| `.rag-label` | 1 | 18px / 180% |
| `.tile` | 1 | no blur |
| `.attn-head` | 1 | no blur |
| `.sheet-arch li` | 1 | no blur |
| `.boot-skip` | 3 | 18px / 170% |

- [ ] **Step 1: Fix `.research-entry` — the bug**

It carries the glass fill, border and inner specular but no `backdrop-filter`, so it is glass styling with nothing refracted behind it. Give it the tier 2 treatment in full, including the blur it was missing:

```css
.research-entry {
  height: 100%;
  display: grid;
  align-content: space-between;
  gap: 0.5rem;
  padding: clamp(1.35rem, 2.5vw, 1.75rem);
  border-radius: var(--r-lg);
  background: linear-gradient(160deg, var(--lens-2-fill-a), var(--lens-2-fill-b));
  backdrop-filter: blur(var(--lens-2-blur)) saturate(var(--lens-2-sat));
  -webkit-backdrop-filter: blur(var(--lens-2-blur)) saturate(var(--lens-2-sat));
  border: 1px solid var(--lens-2-edge);
  box-shadow:
    var(--lens-2-shadow),
    inset 0 1px 0 0 var(--lens-2-spec),
    inset 1px 0 0 0 var(--lens-2-edge-hi),
    inset -1px 0 0 0 var(--lens-2-edge-lo),
    inset 0 -1px 0 0 var(--lens-2-edge-lo);
}
```

- [ ] **Step 2: Migrate the remaining eleven**

Same shape as Task 2 Step 2, tier per the table. Keep every non-glass declaration — `.tile`'s hover `perspective` transform and its `::after` sweep, `.attn-head`'s `[data-on]` states, `.rag-label`'s `[data-hot]` states.

`.station-legend` is the one exception to the fill rule: it sits directly over the canvas and needs to stay readable, so it keeps its dark literal `rgba(10, 12, 20, 0.72)` as `fill-a` and moves only blur, saturate, edge and specular onto tokens.

`.mobile-nav` at `sections.css:91` is left exactly as it is. Its `backdrop-filter: none` is deliberate and the comment above it explains why: it covers the page, so there is nothing behind it to blur, and at 3% white the hero headline ghosted through the links.

- [ ] **Step 3: Run the guard**

Run: `npm run check:glass`
Expected: PASS — `check:glass: every glass surface reads its tier tokens`

- [ ] **Step 4: Confirm the build still compiles**

Run: `npm run build`
Expected: compiles with no CSS errors and no new lint warnings.

- [ ] **Step 5: Commit**

```bash
git add app/sections.css app/motion.css
git commit -m "Move the section and motion surfaces onto the glass tiers"
```

---

### Task 4: Station tint

**Files:**
- Modify: `app/components/world/WorldMount.tsx` (publish the frame on the document root)
- Modify: `app/globals.css` (register `--glass-tint`, per-station values, mix it into the tier fills)

**Interfaces:**
- Consumes: the `frame` state WorldMount already tracks, one of `'field' | 'net' | 'descent' | 'rag' | 'vantage'`, which `World` reports through `onFrame`.
- Produces: `--glass-tint` on `:root`, mixed into `--lens-{1,2,3}-fill-a`.

`CameraRig` needs no change. WorldMount already knows the active station and already renders it as `data-frame` on `.world`; the panes are outside that element, so the same value moves to the document root where every pane inherits it.

- [ ] **Step 1: Publish the frame on the document root**

In `app/components/world/WorldMount.tsx`, add an effect after the existing capability-probe effect:

```tsx
  /* The panes are not inside .world, so the active station has to reach them
     from the root. Tint is then pure CSS: no per-frame style writes. */
  useEffect(() => {
    document.documentElement.dataset.frame = frame;
  }, [frame]);
```

- [ ] **Step 2: Register and animate the tint**

In `app/globals.css`, above `:root`:

```css
/* Registered so it can be transitioned. An unregistered custom property is
   an untyped string to the animation engine and would snap between
   stations instead of travelling along the ramp. */
@property --glass-tint {
  syntax: '<color>';
  inherits: true;
  initial-value: #5442b5;
}
```

Inside `:root`, after the ramp:

```css
  /* The wash a pane borrows from the world behind it. Held to a low
     percentage in the fills: it tints the pane, never the copy. */
  --glass-tint: var(--r1);
  transition: --glass-tint 1.4s var(--ease);
```

Then the per-station values, after the `:root` block:

```css
/* Each station lends its own place on the ramp to the glass in front of it,
   so a pane read beside the network reads periwinkle and the same pane read
   beside retrieval reads aqua. In scroll order. */
:root[data-frame='field']   { --glass-tint: var(--r1); }
:root[data-frame='net']     { --glass-tint: var(--r2); }
:root[data-frame='descent'] { --glass-tint: var(--r3); }
:root[data-frame='rag']     { --glass-tint: var(--r4); }
:root[data-frame='vantage'] { --glass-tint: var(--iris); }

@media (prefers-reduced-motion: reduce) {
  :root { transition: none; }
}
```

- [ ] **Step 3: Mix the tint into the tier fills**

Change only the `fill-a` of each tier:

```css
  --lens-1-fill-a: color-mix(in oklab, var(--glass-tint) 5%, rgba(255, 255, 255, 0.045));
  --lens-2-fill-a: color-mix(in oklab, var(--glass-tint) 7%, rgba(255, 255, 255, 0.055));
  --lens-3-fill-a: color-mix(in oklab, var(--glass-tint) 8%, rgba(255, 255, 255, 0.075));
```

The percentages stay this low deliberately: `--faint #78839c` measures 5.32:1 on `--void` and is the tightest text colour on the page. A heavier wash erodes it.

- [ ] **Step 4: Run the guard and the build**

Run: `npm run check:glass && npm run build`
Expected: guard PASSes, build compiles.

- [ ] **Step 5: Commit**

```bash
git add app/components/world/WorldMount.tsx app/globals.css
git commit -m "Let each station tint the glass in front of it"
```

---

### Task 5: Widen the pointer specular to every pane

**Files:**
- Modify: `app/components/motion.tsx:481` (the `closest` selector)
- Modify: `app/globals.css` (a shared highlight so panes other than `.panel` respond)

**Interfaces:**
- Consumes: `--mx`, `--my`, `--lit`, already written by the existing `Specular` component.

`Specular` already exists at `app/components/motion.tsx:459` and already does the delegated-listener, rAF-throttled, reduced-motion-and-coarse-pointer-gated work the spec asked for. It only reaches three selectors. This task widens it and gives the other panes something to show.

- [ ] **Step 1: Widen the selector**

In `app/components/motion.tsx:481`, replace:

```tsx
      const pane = hit?.closest?.('.panel, .rowglass, .net') as HTMLElement | null;
```

with:

```tsx
      /* Every tier-2 and tier-3 pane. Tier 1 is left out on purpose: those
         appear in walls of twenty or more, and a highlight chasing the
         pointer across a wall of chips reads as noise, not as material. */
      const pane = hit?.closest?.(
        '.panel, .rowglass, .research-entry, .net, .attn, .descent, .rag, ' +
          '.station-legend, .glass-btn, .topbar',
      ) as HTMLElement | null;
```

- [ ] **Step 2: Give every pane the highlight**

In `app/globals.css`, after the tier tokens:

```css
/* The specular follows the pointer instead of sitting at the top-left. One
   delegated listener writes --mx/--my/--lit onto the pane under the cursor;
   this is what those properties drive. A pane that never receives them
   renders a fully transparent gradient, which is why this can be a blanket
   rule. background-image rather than background, so it layers over each
   tier's fill instead of replacing it. */
.panel, .rowglass, .research-entry, .net, .attn, .descent, .rag,
.station-legend, .glass-btn, .topbar {
  --mx: 50%;
  --my: 0%;
  --lit: 0;
  background-image: radial-gradient(
    42% 60% at var(--mx) var(--my),
    rgba(255, 255, 255, calc(0.10 * var(--lit))),
    transparent 72%
  );
  transition: background-image 0.35s var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  .panel, .rowglass, .research-entry, .net, .attn, .descent, .rag,
  .station-legend, .glass-btn, .topbar {
    background-image: none;
  }
}
```

- [ ] **Step 3: Run the guard and the build**

Run: `npm run check:glass && npm run build`
Expected: guard PASSes — the `rgba(255, 255, 255, calc(...))` above is a `background-image` declaration, which the guard's `(background|border|box-shadow)\s*:` pattern does not match.

- [ ] **Step 4: Commit**

```bash
git add app/components/motion.tsx app/globals.css
git commit -m "Let the pointer specular reach every pane"
```

---

### Task 6: Performance and the quality floor

**Files:**
- Modify: `app/sections.css` (band containment)

- [ ] **Step 1: Keep offscreen bands off the compositor**

In `app/sections.css`, beside the existing `.band` rules:

```css
/* A band nowhere near the viewport still costs a backdrop-filter composite
   for every pane inside it. The intrinsic size is a hint for the scrollbar,
   not a constraint: bands re-measure when they come into view. */
.band {
  content-visibility: auto;
  contain-intrinsic-size: auto 900px;
}
```

Do not apply this to the hero or to `#contact`. The hero is above the fold from the first paint, and `#contact` is a camera station whose measured height `CameraRig` depends on — `measure()` reads `getBoundingClientRect()` on the anchored section, and a contained element reports its intrinsic placeholder height instead of its real one, which would desync the camera path.

- [ ] **Step 2: Verify focus survives on all three tiers**

Run `npm run dev`, then tab through: skip link, topbar links, hero buttons, work cards, contact actions. The `:focus-visible` outline (`2px solid var(--gold)`, `globals.css:145`) must stay visible on every tier, including tier 3's brighter fill.

- [ ] **Step 3: Build, lint, guard, and commit**

Run: `npm run build && npm run lint && npm run check:glass`
Expected: all three pass.

```bash
git add app/sections.css
git commit -m "Keep offscreen bands off the compositor"
```

---

## Author verification

The agent's browser is on a different host and cannot reach the dev server, so these are yours to run:

1. Kill whatever holds port 3000 — it is serving a pre-`749a3fc` build with the old Fraunces type — then `npm run dev` and confirm the page uses Archivo.
2. Compare two panes at the same tier side by side: `.panel` against `.research-entry`, `.topbar` against `.glass-btn`. Same depth, same temperature.
3. Scroll all nine bands. The tint moves violet to periwinkle to cyan to aqua to magenta, and the copy stays legible the whole way.
4. Hover a card: the highlight tracks the pointer. Hover a chip: it does not.
5. Reduced motion on: no tint transition, no pointer highlight.
6. 320px: no horizontal scroll, tier 1 opaque, page still readable.
