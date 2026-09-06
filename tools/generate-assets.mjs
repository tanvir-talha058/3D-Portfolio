// One-off asset generation: OG share image, PWA icons, optimized avatar
// variants. Not part of the build pipeline — run manually when source
// assets (assets/source/avatar-source.png, public/favicon.svg) change.
//   node tools/generate-assets.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const sourceDir = path.resolve(__dirname, '..', 'assets', 'source');

const BG = '#07090e';
const CYAN = '#00f0ff';
const VIOLET = '#8b5cf6';

async function generateOgImage() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${CYAN}" />
        <stop offset="100%" stop-color="${VIOLET}" />
      </linearGradient>
      <radialGradient id="glow" cx="85%" cy="15%" r="60%">
        <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.22" />
        <stop offset="100%" stop-color="${CYAN}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="glow2" cx="10%" cy="90%" r="55%">
        <stop offset="0%" stop-color="${VIOLET}" stop-opacity="0.18" />
        <stop offset="100%" stop-color="${VIOLET}" stop-opacity="0" />
      </radialGradient>
    </defs>

    <rect width="1200" height="630" fill="${BG}" />
    <rect width="1200" height="630" fill="url(#glow)" />
    <rect width="1200" height="630" fill="url(#glow2)" />

    <rect x="80" y="88" width="96" height="96" rx="22" fill="url(#accent)" />
    <text x="128" y="156" font-size="52" font-weight="900" text-anchor="middle"
          fill="${BG}" font-family="Arial, sans-serif">T</text>

    <text x="80" y="330" font-size="72" font-weight="800" fill="#f8fafc"
          font-family="Arial, sans-serif">Tanvir Ahmed</text>
    <text x="80" y="392" font-size="36" font-weight="600" fill="${CYAN}"
          font-family="Arial, sans-serif">AI / ML Engineer &amp; Researcher</text>
    <text x="80" y="452" font-size="24" fill="#94a3b8"
          font-family="Arial, sans-serif">Multilingual RAG · Large Language Models · Computer Vision · FinTech AI</text>

    <rect x="80" y="502" width="1040" height="1" fill="#1e293b" />
    <text x="80" y="558" font-size="22" fill="#64748b"
          font-family="Arial, sans-serif">upay (UCB Fintech) · Bangladesh</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(publicDir, 'og-image.png'));
  console.log('Generated public/og-image.png (1200x630)');
}

async function generatePwaIcons() {
  const faviconSvg = path.join(publicDir, 'favicon.svg');

  for (const size of [192, 512]) {
    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `icon-${size}.png`));
    console.log(`Generated public/icon-${size}.png`);
  }

  // Maskable icon: safe-zone padding (icon content in the inner ~80%) so OS
  // masks (circle, squircle, etc.) don't clip the "T" mark.
  const maskableSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${CYAN}" />
        <stop offset="100%" stop-color="${VIOLET}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#grad)" />
    <text x="50%" y="63%" font-size="42" font-weight="900" text-anchor="middle"
          fill="${BG}" font-family="Arial, sans-serif">T</text>
  </svg>`;

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('Generated public/icon-maskable-512.png');
}

async function generateFaviconIco() {
  const faviconSvg = path.join(publicDir, 'favicon.svg');
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) => sharp(faviconSvg).resize(size, size).png().toBuffer())
  );
  const icoBuffer = await pngToIco(pngBuffers);
  writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico (16/32/48px)');
}

async function generateAvatarVariants() {
  const source = path.join(sourceDir, 'avatar-source.png');

  const targets = [
    { size: 160, name: 'avatar-160' },
    { size: 900, name: 'avatar-900' }
  ];

  for (const { size, name } of targets) {
    await sharp(source)
      .resize(size, size)
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, `${name}.webp`));

    await sharp(source)
      .resize(size, size)
      .png({ quality: 82, compressionLevel: 9 })
      .toFile(path.join(publicDir, `${name}.png`));

    console.log(`Generated public/${name}.webp + .png`);
  }
}

mkdirSync(publicDir, { recursive: true });

await generateOgImage();
await generatePwaIcons();
await generateFaviconIco();
await generateAvatarVariants();

console.log('Done.');
