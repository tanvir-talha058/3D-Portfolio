# One world, one camera

Date: 2026-08-28

## Problem

The page holds six WebGL scenes — field, network, loss surface, retrieval,
attention, and the boot intro — each in its own `<Canvas>` with its own
camera and render loop. They read as six separate figures the reader scrolls
past, not as one space the reader moves through. `InstrumentRail` was a half
step: it pinned one figure beside the narrative middle, but the figures still
cut to each other rather than connecting.

## Decision

One `<Canvas>`, fixed and full-viewport, mounted once behind the page. Each
existing `Scene` becomes a **station**: a `<group>` at a fixed world position
inside that shared canvas. Scroll progress drives a single camera along an arc
that passes each station in turn.

Every scene file already separates `function Scene(...)` from the default
export that wraps it in `<Canvas>`, so the scenes themselves are reused
almost as-is.

### Stations

| # | Scene | Anchored to |
|---|---|---|
| 0 | point field + domain anchors | hero |
| 1 | network | expertise, experience |
| 2 | loss surface | method |
| 3 | retrieval stack | work |
| 4 | attention map | research |
| 5 | pull back, whole path visible | contact |

Laid out on a gentle arc through XZ so travel reads as flight, not zoom.

### Camera

One rig owns the camera. Scroll progress maps to a position along the arc,
damped so it eases rather than tracking the wheel 1:1. Each station carries a
framing (position, lookAt, fov) and the rig interpolates between the two it
lies between.

Several scenes currently drive `state.camera` inside their own `useFrame` —
Rag and Descent set it per frame, Field has a `Rig`. In a shared world exactly
one rig may own the camera, so that per-scene camera work moves out into the
station's framing data.

### Readability

This is the real risk. The previous four rounds of work were spent making the
page readable and professional, and live 3D behind every paragraph is the
fastest way to undo that.

Each content column sits on a scrim — a soft dark gradient holding text
contrast — while the world stays visible in the margins, between sections, and
behind the glass panels that already sit over moving backgrounds well. The
world is the room; the text is on a card in the room, not painted on the wall.

If the result reads worse than what it replaces, say so and stop rather than
ship it.

### Performance

One canvas is cheaper than the current six: today up to two contexts run at
once, each with its own loop. Only stations within one step of the camera are
mounted; the rest unmount entirely.

Mobile runs the full experience, tuned down: DPR capped at 1.5, no antialias,
reduced particle counts and geometry detail, and a two-station mount window.
Measure FPS at 390px before and after and report real numbers.

### Fallbacks

- No WebGL: the current stacked layout, unchanged.
- `prefers-reduced-motion`: camera snaps between stations, no drift, no idle
  animation.
- All figure legends stay DOM text, so the content survives with no canvas.

## Staging

Each step independently verifiable; stop at any of them.

1. Shared canvas + camera rig, hero field only — proves the architecture.
2. Stations 1–2 migrated, `InstrumentRail` retired.
3. Stations 3–5, scrims tuned.
4. Mobile tuning, full audit at 360/390/430/768/1440.

## Non-goals

- No change to the type system, colour ramp, or copy.
- The boot intro keeps its own canvas: it is an overlay with a different
  lifetime, and it unmounts before the page is interactive.
