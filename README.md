# 3D Portfolio — Tanvir Ahmed

Personal portfolio for an AI/ML engineer, built as an interactive WebGL experience
rather than a static page. Live scenes, refractive glass surfaces, and a design
system derived from a scientific colormap.

## What's in it

**A latent field hero.** ~3,400 GPU points arranged as a projected embedding space:
70% cluster around six anchor nodes representing real domains in the work, the rest
are background scatter. Distance from a cluster centroid drives the colour ramp, so
dense cores read hot and diffuse edges read cold. Hovering a node ignites its
cluster; clicking navigates to that section. Scrolling flies the camera through the
field.

**A live neural network.** Four fully-connected layers with a signal wave that
propagates left to right — each layer and its edges brighten as the front reaches
them. A real diagram of how every system on the page works, not an ornament.

**An attention map you can read.** The research section renders a 10x10
self-attention matrix over a Banglish banking query — the exact register the UCB
assistant has to handle. Rows are genuinely softmax-normalised, tile height and
colour both carry the weight, and four heads (positional, syntactic, lexical,
aggregate) each do a different job. Pick a head, hover a token, and the caption
reports the actual numbers that row spends its attention on.

**A loss landscape being descended.** The method section runs momentum SGD against
the analytic gradient of a real two-basin surface. The step counter and loss
readout are live, and because every run starts somewhere new, which minimum it
finds genuinely depends on where it began.

**Refractive glass.** The hero core is a faceted crystal on
`MeshTransmissionMaterial`, so the point field genuinely bends through it. Surfaces
across the page are layered glass with a specular highlight that tracks the cursor.

## Design system

The accent palette is a magma colormap — `#2e2a4f → #6b4a7e → #b2506a → #e07a55 →
#f2c063` — used semantically as a scale rather than decoratively: cold for
structure, hot for signal.

Type is Fraunces (display), Archivo (UI and body), and JetBrains Mono (data and
labels), on a locked 1.25 modular ratio that scales fluidly between 320px and
1440px. Every control snaps to a 4px grid.

A project's accent colour is the colour of its own node in the hero field, so the
work grid and the latent field are one map rather than two decorations. The stack
is set as a typographic index rather than a wall of pills, and the build pipeline
runs vertically with each step tinted one stop further along the ramp — the list
literally heats up from intake to impact.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind + custom CSS layers ·
three.js / react-three-fiber / drei

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

> Stop the dev server before running `build` — both write to `.next`.

## Accessibility and performance

- `prefers-reduced-motion` is respected throughout: the custom cursor and headline
  assembly are disabled, scroll behaviour goes instant, and all reveals render in
  their final state. The scenes hold a still frame rather than an empty one — the
  descent runs to convergence on its first frame and parks at the minimum.
- The attention map's controls are real buttons: heads and tokens are reachable by
  keyboard, and the readout is an `aria-live` region.
- No custom cursor on touch devices.
- Animated headline characters are `aria-hidden`; each heading carries its real
  text as an `aria-label`.
- The case-study sheet traps focus, closes on `Escape`, locks background scroll,
  and restores focus to its trigger.
- three.js is lazy-loaded and stays out of the initial bundle (first load is 103 kB).
  All four scenes freeze their render loop when scrolled off screen, and the expensive transmission material
  drops to a cheaper one on low-core or small-viewport devices.
- A static fallback renders when WebGL is unavailable.

## Contact

[tanvirahmed123000@gmail.com](mailto:tanvirahmed123000@gmail.com) ·
[GitHub](https://github.com/tanvir-talha058) ·
[LinkedIn](https://linkedin.com/in/tanvir-talha058)
