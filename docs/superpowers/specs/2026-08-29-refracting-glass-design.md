# Refracting Glass — Design

**Status:** approved for planning
**Date:** 2026-08-29
**Extends** `2026-08-29-liquid-glass-system-design.md`, which stays authoritative for the CSS material.

## Problem

The liquid glass system gave every pane one material at three elevations, and it works. But its whole vocabulary is `backdrop-filter`: blur, saturate, a tinted fill, and a directional inset shadow standing in for edge lensing. CSS can blur what sits behind a pane. It cannot bend it.

Real glass bends. A thick pane with a rounded rim displaces what is behind it, and the displacement is wavelength-dependent, so the rim fringes into colour while the interior stays clear. That is the difference between glass and frosting, and it is the difference the page is currently missing. The world canvas is right there behind every pane, and no pane reacts to it optically.

## Goal

Every glass pane refracts the world behind it: interior nearly clear, rims bending and dispersing what they cover, with a specular that agrees with the edge lighting the CSS already does. The material stays one material — a pane differs from another pane along the same single axis it does today, elevation.

## Non-goals

- No idle animation of the glass itself. The material is optically still; what moves is what it refracts and how it responds. `.calude.md` asks for "expensive and controlled", and breathing glass reads as neither.
- No deformation, no merging blobs, no per-pane bulge under the pointer.
- No move of page content into 3D. Text stays DOM, crisp and selectable.
- No replacement of the CSS material. Refraction augments it.

## Decisions

**Augment, not replace.** Panes keep their `backdrop-filter`, their tier tokens, and all 16 recipes. Refraction is drawn behind them, in the world canvas. If WebGL is unavailable, if the pass fails, or if the machine is on the low tier, the page is byte-for-byte what it is today. The CSS glass is the floor on every path — that is what this decision buys, and it is why `check:glass` and the recipe set survive untouched.

**One canvas, one context.** WebGL cannot sample a texture owned by another canvas's context. The sharpest possible result would put an overlay canvas above the DOM so the rims are never softened by the pane's own blur — but that canvas could not see the world, and would have to render a second, quarter-resolution copy of the entire scene, with a second render loop and a second mount window to keep in sync. Not worth it. Refraction happens inside the existing canvas, and the pane's blur softening it is paid for by bringing the tier blur tokens down.

**Rim-concentrated, which is also correct.** Displacement is near zero across a pane's interior and rises steeply within a rim band. This is not a concession to the blur above it; it is what a thick pane with a rounded edge actually does. Interior clarity is why text over glass stays readable.

**Panes are found by selector, not marked in JSX.** A single map from CSS selector to tier mirrors the 16 recipes. No component changes — the same discipline the liquid glass plan used. The guard script enforces that the map and the stylesheets agree.

## Architecture

New directory `app/components/world/glass/`.

### `recipes.ts`

The selector-to-tier map, one entry per CSS recipe:

| tier | selectors |
|------|-----------|
| 1 | `.chip`, `.pipeline-step`, `.rag-label` |
| 2 | `.panel`, `.rowglass`, `.research-entry`, `.net`, `.attn`, `.descent`, `.rag`, `.station-legend` |
| 3 | `.node-label`, `.sheet`, `.glass-btn`, `.topbar`, `.boot-skip` |

Exports per-tier refraction constants — rim width, index, dispersion, specular gain — that move monotonically across the three tiers, exactly as the CSS tokens do. A tier 3 pane floats higher, so it is thicker, so it bends more.

### `paneRegistry.ts`

The DOM side. Owns no React state; writes into a caller-provided `Float32Array`.

- Resolves the selector map to elements once, and again on `MutationObserver` for panes that mount later (the sheet, node labels).
- Per update: `getBoundingClientRect()`, computed `border-radius`, tier, and a response value (0 at rest, rising on `:hover` / `:focus-visible`).
- Culls to the viewport plus a one-rim margin, sorts by area, caps at **24 panes**. A pane that loses the cap contributes nothing; it still has its CSS glass, so it degrades to today's appearance rather than to nothing.
- Rects are in CSS pixels, converted to the canvas's pixel space at write time. Nothing is hardcoded per breakpoint: the shader only ever knows what the DOM reports, which is what makes the effect correct at every viewport width.
- DOM reads are driven from `scroll`, `resize`, `pointerover`/`pointerout` and `focusin`/`focusout`, plus a `ResizeObserver` on the observed elements — never from inside `useFrame`. The `enter` and `response` values are targets set by those events and eased toward per frame from the held buffer, so animation costs no layout.

Buffer layout, per pane: `vec4 rect (x, y, w, h)` and `vec4 params (radius, tier, enter, response)`. Two `vec4` arrays of 24.

### `glassMaterial.ts`

The composite shader, as a `RawShaderMaterial` factory. Fragment, per pixel:

1. `d` — minimum signed distance to the 24 rounded rects.
2. `thickness` — `1 - smoothstep(0, rimWidth, -d)` inside a pane, 0 outside. Zero across the interior, rising to 1 at the rim.
3. `normal` — normalized gradient of the SDF, taken analytically from the nearest rect rather than by sampling, so it stays exact at small radii.
4. UV offset — `normal * thickness^2 * strength(tier)`, with R, G and B sampled at `offset * (1 ± dispersion)` so rims fringe into colour.
5. Specular — a Blinn term against a light fixed to the upper left, matching the direction `--lens-N-edge-hi` already lights, so the WebGL highlight and the CSS one describe the same light.
6. Tint — the station tint arrives as a uniform and warms the refracted sample, so a pane's refraction shifts violet → periwinkle → cyan → aqua → magenta with the rest of the page.

Alpha from the render target passes through the displaced sample, so the page background still shows through exactly where it does now.

### `GlassComposite.tsx`

An R3F component that takes over rendering.

- Allocates a `WebGLRenderTarget` sized to the drawing buffer, `alpha: true`, resized on `size` change.
- `useFrame(…, 1)`. A non-zero priority disables R3F's automatic render, so this owns the frame: scene → target, target → screen through the composite quad. `CameraRig` keeps priority 0 and still runs first.
- Skips the composite entirely on frames where the registry reports no visible pane, rendering the scene straight to screen instead, so a section with no glass in view costs nothing extra.
- On any failure — no WebGL2, target allocation failure, shader compile error — it reports upward and unmounts, and R3F resumes its default render.

### Wiring

- `World.tsx` mounts `GlassComposite` only when `quality === 'high'` and `reduced === false`.
- `globals.css`: tier blur tokens come down (roughly a third) so refraction reads through the pane's own blur. Fill, edge and specular tokens are unchanged — the contrast floor depends on the fills, not the blur.
- `scripts/check-glass.mjs` gains a check that every selector owning a `--lens-N-blur` in the stylesheets appears in `recipes.ts` at the same tier, and vice versa. The two sources of truth cannot drift.

## Responsiveness and animation

The material is still; the responses are animated.

- **Enter.** A pane's refraction strength eases 0 → 1 over ~320ms as it enters the viewport, so panes resolve into glass rather than popping.
- **Pointer and focus.** `:hover` and `:focus-visible` ease the rim toward a brighter specular and a slightly wider band. The registry reads the state; the shader animates the value. CSS keeps owning the fill, so the two highlights never fight.
- **Scroll.** No special casing. The rects move, the refraction follows, and because the world moves too, a pane reads as a lens held over a moving scene.
- **Breakpoints.** Below 900px the rim band narrows and dispersion halves. On a 320px-wide pane a full-width rim would be most of the pane, and the effect would read as a smear rather than an edge.
- **Reduced motion.** The composite does not mount. No enter easing, no pointer response, no refraction — identical to the page today.

## Performance

- One extra fullscreen pass and one render target. No per-pane draw calls; 24 panes cost 24 SDF evaluations in one fragment shader, not 24 render passes.
- The pass is skipped on frames with no visible pane.
- Low tier and reduced motion never mount it.
- Budget: the composite must not push a mid-range laptop below 55fps at the densest band. If it does, the levers in order are the pane cap, then rim width, then a half-resolution refraction sample.

## Accessibility and contrast

Body text stays at or above 4.5:1 on its pane, and `--faint #78839c` at 5.32:1 on `--void` remains the tightest case. Refraction sits *behind* the pane fill, so it cannot lighten the text's immediate backdrop past what the fill already sets — but the lowered blur tokens let more world energy through, so the floor is re-measured, not assumed. `:focus-visible` outlines are drawn by the DOM, above everything here, and are unaffected.

## Testing

Automated:

- `npm run check:glass` — the existing invariant, plus the new recipe-coverage check in both directions.
- `npm run build && npm run lint` — clean.

Author verification against the dev server, which the agent cannot reach:

1. Rims fringe into colour where a pane covers a world station; the interior stays clear enough to read.
2. Two panes at the same tier still read as the same depth and temperature.
3. The tint still moves through all five stations, and refraction moves with it.
4. Hover a card: the rim brightens. Hover a chip: it does not.
5. Reduced motion on: indistinguishable from today.
6. 320px: no horizontal scroll, rims narrow, page readable.
7. Kill WebGL in devtools: the fallback rings render and the CSS glass is intact.

## Risks

- **The blur eats it.** The one real risk of choosing a single context. Mitigated by lowering the blur tokens; if the result is still too soft, the documented follow-up is the rim overlay canvas, which was costed and deferred, not dismissed.
- **Registry cost.** `getBoundingClientRect()` on up to 24 elements forces layout. Mitigated by reading rects on scroll and resize only, holding them between events, and never touching the DOM inside `useFrame`.
- **Drift between the map and the CSS.** Mitigated by the guard check; this is precisely why it is in scope rather than left to discipline.
