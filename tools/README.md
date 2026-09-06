# Dev Tools

Local Puppeteer-based scripts for capturing screenshots and checking runtime
errors against a running dev server. Not part of the build; not deployed.

Requires the Vite dev server running first: `npm run dev` (defaults to
`http://127.0.0.1:3000/`).

Override the Chrome binary or target URL with env vars if needed:

```
CHROME_PATH="C:/path/to/chrome.exe" DEV_URL="http://127.0.0.1:3000/" npm run capture:screenshots
```

- `npm run capture:screenshots` — desktop dark/light + mobile screenshots
- `npm run capture:command-center` — Command Center (Ctrl+K) screenshot
- `npm run check:runtime-errors` — logs console/page errors from a live page load

Screenshot output lands in the repo root and is gitignored.

## Bundle size budget

`npm run check:bundle-size` (run in CI after `npm run build`) reads
`dist/assets/` and fails if a tracked chunk — the main bundle, the `three`
chunk, and the lazy `Playground`/`Research`/`Education` chunks — grows past
its budget in `tools/check_bundle_size.mjs`. Budgets carry headroom above
current baselines; if a change legitimately grows a chunk, bump its budget
in that file alongside the change rather than treating the failure as a
blocker to route around.

## Regenerating avatar assets

`node tools/generate-assets.mjs` derives `public/avatar-160.{png,webp}` and
`public/avatar-900.{png,webp}` (plus the OG image and PWA icons) from
`assets/source/avatar-source.png`, which has its studio backdrop already
removed (transparent PNG) so it composites onto the site's dark/light theme
instead of showing a gray backdrop. The original studio photo is kept at
`assets/source/avatar-source-studio-original.png` for reference.

If the source portrait is ever replaced, background removal was done with
`@imgly/background-removal` (WASM, browser-only — the Node-native
`@imgly/background-removal-node` package failed to load its ONNX binding on
this machine) run in an actual browser tab rather than a CLI script — there
is no `npm run` command for it. Load the library from a page (e.g. via the
jsdelivr CDN with an import map for `onnxruntime-web`), call
`removeBackground(imageUrl)` with an **absolute** image URL (a relative path
resolves against the library's CDN origin, not the page's), and save the
resulting blob — note that an element screenshot flattens alpha to white, so
extract the actual PNG bytes (e.g. `fetch(blob URL)` → base64) instead.
