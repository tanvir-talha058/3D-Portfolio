# Liquid Glass — one material for the whole page

**Date:** 2026-08-29
**Status:** approved, pending implementation plan

## Problem

The page already reads as dark and glassy, but the glass is not one
material. Eight surfaces each invent their own recipe, and no two agree:

| Recipe | blur | saturate | fill | border | inner specular |
|---|---|---|---|---|---|
| `.panel` (globals.css:250) | `var(--glass-blur)` 28px | 180% | tokens | `--glass-edge` 0.24 | 0.55 |
| `.sheet` (globals.css:438) | 40px | 180% | literals | `--glass-edge` | 0.28 |
| `.topbar` (globals.css:533) | 26px | 180% | 0.05 | 0.14 | 0.34 |
| `.glass-btn` (globals.css:483) | 24px | 180% | 0.07 | 0.20 | 0.42 |
| `.rowglass` (globals.css:575) | 22px | 170% | literals | 0.13 | 0.30 |
| `.node-label` (globals.css:373) | 20px | 180% | 0.08 | 0.22 | 0.40 |
| `.pipeline-step` (sections.css:441) | 18px | 160% | 0.035 | 0.11 | 0.26 |
| `.chip` (globals.css:319) | 14px | 160% | 0.045 | 0.14 | 0.30 |

Six of the eight bypass the `--glass-*` tokens that already exist.
Separately, `.research-entry` (sections.css:595) carries the glass fill,
border and inner specular but **no `backdrop-filter`** — glass styling
with nothing refracted behind it.

The result: surfaces that should read as panes of the same material sit
at visibly different depths and temperatures. This is what "not pixel
perfect" means here — it is a token problem, not a taste problem.

## Goal

One glass material, expressed as a token-driven elevation scale, applied
to every surface on the page. Nothing invents its own blur again.

## Non-goals

- No change to the palette. Prismatic Abyss (`--void`..`--ridge`, the
  dichroic ramp `--r0`..`--r4`, `--iris`) stays exactly as it is.
- No change to typography. Archivo's `wdth` axis driven per heading tier
  is the page's distinctive move; changing faces now is churn.
- No change to page structure. The nine bands, the left rail and the
  single world canvas stay.

## Design

### 1. Elevation scale

Glass differs along one axis only: how far the pane floats above the
world canvas. Three tiers, each a complete set of values:

- `--lens-1` — **inset**: chips, tiles, pipeline steps, node labels.
  Sits nearly flush. Low blur, tight edge, minimal lift.
- `--lens-2` — **raised**: cards, rows, panels, research entries. The
  default pane; most of the page is this tier.
- `--lens-3` — **floating**: topbar, sheet, mobile nav, buttons. Clears
  the page; highest blur, brightest specular, deepest shadow.

Each tier defines: `blur`, `saturate`, `fill-a`, `fill-b`, `edge`,
`spec`, `shadow`. Every surface picks a tier; no surface sets a raw
`backdrop-filter` value.

### 2. The `.lens` primitive

One class implements a tier. Structure, in stacking order:

1. blurred + saturated backdrop (`backdrop-filter`)
2. fill gradient (`fill-a` -> `fill-b`, 160deg)
3. edge lensing — a two-stop gradient border replacing today's flat
   `1px solid`, brighter at the top-left where the light is
4. inner specular (`inset 0 1px 0`) and outer shadow

Modifiers: `.lens--1`, `.lens--2`, `.lens--3`, plus `.lens--opaque` for
surfaces that cover the page rather than float over it.

`.lens--opaque` exists because of a real constraint already documented at
globals.css:85 — `.mobile-nav` covers the viewport, so there is nothing
behind it to refract and the hero headline ghosted through the links.
Opaque fill, no `backdrop-filter`. `.research-entry` gets the opposite
fix: it becomes a true `.lens--2` with the blur it was missing.

### 3. Station tint

The signature, and the one thing that makes this material specific to
this page rather than a generic glass kit.

`CameraRig` already tracks which world station the camera is at.
It publishes that as a custom property on the document root
(`--glass-tint`, plus a 0..1 blend factor). Panes mix a low-alpha wash of
that hue into `fill-a`, so glass near the Net station reads periwinkle
(`--r2`) and glass near Rag reads aqua (`--r4`).

The tint is a wash, never a text background: it changes the pane, not the
contrast of the copy on it.

### 4. Pointer specular

On a `.lens--2` or `.lens--3` surface, the specular highlight tracks the
pointer instead of being pinned to the top-left, and the pane's radius
breathes on press (spring easing, back to rest on release).

Implemented as two custom properties (`--px`, `--py`) written by one
delegated pointermove listener on the page root, not a listener per card.
Under `prefers-reduced-motion: reduce` the highlight stays pinned and the
press animation is dropped.

### 5. Performance

`backdrop-filter` over a live WebGL canvas is the real cost, and this
change increases the number of blurred layers.

- Blur budget per tier drops on `max-width: 640px` (extends the existing
  rule at globals.css:593, which only moves `--glass-blur`).
- `content-visibility: auto` with a `contain-intrinsic-size` on offscreen
  bands so their panes are not composited while out of view.
- `.lens--1` surfaces appear in walls of 20+ (chips, tiles). They get the
  lowest blur of the three tiers, and on mobile drop to an opaque fill.
- Verify against the existing frame budget after implementation; if a
  wall of tiles regresses it, `.lens--1` loses `backdrop-filter` entirely
  and keeps the fill and edge.

### 6. Quality floor

- Body text keeps >= 4.5:1 against the pane it sits on, including with
  the station tint at full blend. `--faint` (#78839c) is already the
  tightest at 5.32:1 on `--void`; the tint wash must not erode it.
- `:focus-visible` outline stays as is and must remain visible on all
  three tiers.
- `prefers-reduced-motion` drops pointer specular, press spring, and
  tint transitions.
- Responsive to 320px.

## Files touched

- `app/globals.css` — tier tokens, `.lens` primitive; delete the six
  ad-hoc recipes and point `.panel`, `.topbar`, `.glass-btn`,
  `.rowglass`, `.node-label`, `.chip`, `.sheet` at tiers.
- `app/sections.css` — `.pipeline-step`, `.research-entry`, `.tile`,
  `.edu-card`, `.expertise-card`, `.method-*`, work cards, `.awards`,
  `.contact-card`, `.footer` adopt tiers; remove their local blur.
- `app/motion.css` — pointer specular and press spring.
- `app/components/world/CameraRig.tsx` — publish `--glass-tint`.
- `app/components/motion.tsx` — delegated pointermove writing `--px`/`--py`.

## Verification

The browser available to the agent is on a different host and cannot
reach the dev server, so visual checks are the author's to run locally:

1. `npm run dev`, confirm the served page uses Archivo (not Fraunces) —
   a stale pre-`749a3fc` dev server has been occupying port 3000.
2. Every pane at the same tier reads at the same depth and temperature.
3. Scroll through all nine bands: tint shifts with the station, copy
   stays legible throughout.
4. Reduced-motion on: no pointer specular, no press spring.
5. 320px width: no horizontal scroll, blur budget respected.
