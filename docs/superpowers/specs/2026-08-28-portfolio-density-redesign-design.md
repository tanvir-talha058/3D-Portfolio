# Portfolio density & immersion redesign

Date: 2026-08-28
Branch: redesign-webgl-portfolio

## Problem

The page reads as unfocused and padded out. Three measured causes:

1. **Everything is centre-aligned.** `app/align.css` (205 lines, loaded last)
   re-sets the page onto a centre axis. Its own header records that the page
   "was set left-aligned and editorial". Centred body copy is hard to read,
   and because nothing shares a left edge, two-column sections drain to empty
   on one side.
2. **Ten sections, 13.8 viewports (12,429px at 1440x900).** Several sections
   are inventories that duplicate a neighbour's job.
3. **Uniform 136px band padding, top and bottom.** ~2,450px of the page —
   nearly three viewports — is padding between sections.

A fourth, softer problem: the WebGL work is the strongest material here, but
each visualisation is boxed inside its own section, so it costs a full section
of height and none of them connect.

## Decisions

### 1. Left-aligned grid

Delete `app/align.css` and its import in `app/layout.tsx`. The page returns to
the left-aligned editorial grid the section styles were written for.

One exception: the hero keeps its centre axis. It sits over the WebGL field
as a title card, where a centre axis is correct.

### 2. Ten sections to seven

| Section | Absorbs | Treatment |
|---|---|---|
| About | Education | Degree + 2 awards become a compact credential strip under the lede |
| Expertise | Stack | 3 expertise cards, then the 4 `stackGroups` as a dense chip wall below |
| Work | Research | 6 projects primary; 4 research entries as a lighter secondary tier |

No content is deleted. Nav goes from 6 items to 5.

### 3. Density as rhythm

Replace the flat 136px with a three-step scale:

- `--band-lg: 96px` — work, experience, method
- `--band-md: 64px` — about, expertise
- `--band-sm: 48px` — blocks that should read as continuous with the one above
  (credential strip, chip wall, research tier)

Spacing carries hierarchy instead of being a constant.

### 4. Sticky instrument column

Through the middle of the page (expertise, experience, method, work) the
content scrolls in a left column while **one canvas stays pinned in a sticky
right column** and changes state with scroll position: field, network, loss
surface, retrieval graph.

- The visuals stop costing vertical space — four sections share one pinned area.
- It reads as one machine driven through its modes rather than four widgets.
- Below 1024px it degrades to the current stacked layout, keeping only the
  loss landscape.

### 5. Removed

- The `SCROLL` cue under the hero.
- Eyebrow rules where the section already carries a heading.
- Duplicate hover-glow on cards that already have a border-lift.

## Non-goals

- No change to the type system (Archivo / IBM Plex Sans / IBM Plex Mono,
  settled in the previous commit).
- No change to the colour ramp.
- No content rewriting beyond the moves above.

## Known defect, fixed alongside

`Boot.tsx` "Skip intro" does not skip. `skip()` (Boot.tsx:461) only advances
the animation clock; it never calls `finish()`. The clock then advances via
`clock.current += Math.min(delta, 0.05)` (Boot.tsx:409), tying playback speed
to framerate. Below ~20fps the overlay lingers, intercepting every click —
measured at 41s headless. Fix: `skip()` calls `finish()` directly.

## Verification

Playwright at 390 / 768 / 1440:

- page height before vs after
- no horizontal scroll at any width
- keyboard focus visible against the new grid
- `prefers-reduced-motion` pins the sticky canvas to a static frame
- zero console errors
- section screenshots at both widths
