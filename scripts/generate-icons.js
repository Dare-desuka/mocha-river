const sharp = require('sharp');
const path = require('path');

const ASSETS = path.resolve(__dirname, '..', 'assets');
const BG = '#0D0D0D';
const CARD = '#f5e0dc';
const CARD_W = '#ffffff';

function cardSVG(s, pad) {
  const c = s - pad * 2;
  const r = c * 0.08;
  const cx = s / 2;
  const cy = s / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" fill="${BG}" rx="${s * 0.08}" />
  <rect x="${pad}" y="${pad}" width="${c}" height="${c}" rx="${r}" fill="${CARD}" />
  <rect x="${pad + c * 0.015}" y="${pad + c * 0.015}" width="${c - c * 0.03}" height="${c - c * 0.03}" rx="${r * 0.85}" fill="none" stroke="#e0d0c0" stroke-width="${c * 0.006}" />
  <g fill="#f38ba8" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.09}" y="${pad + c * 0.09}">♥</text>
  </g>
  <g fill="#b4befe" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.91}" y="${pad + c * 0.09}">♠</text>
  </g>
  <g fill="#94e2d5" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.09}" y="${pad + c * 0.91}">♣</text>
  </g>
  <g fill="#f5e0dc" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.91}" y="${pad + c * 0.91}">♦</text>
  </g>
  <g fill="#f38ba8" font-family="monospace" font-size="${c * 0.35}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${cx}" y="${cy}">♥</text>
  </g>
</svg>`;
}

function cardFG(s) {
  const c = s * 0.76;
  const pad = s * 0.12;
  const cx = s / 2;
  const cy = s / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect x="${pad}" y="${pad}" width="${c}" height="${c}" rx="${c * 0.08}" fill="white" />
  <g fill="#f38ba8" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.09}" y="${pad + c * 0.09}">♥</text>
  </g>
  <g fill="#b4befe" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.91}" y="${pad + c * 0.09}">♠</text>
  </g>
  <g fill="#94e2d5" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.09}" y="${pad + c * 0.91}">♣</text>
  </g>
  <g fill="#f5e0dc" font-family="monospace" font-size="${c * 0.12}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${pad + c * 0.91}" y="${pad + c * 0.91}">♦</text>
  </g>
  <g fill="#f38ba8" font-family="monospace" font-size="${c * 0.35}" font-weight="bold" text-anchor="middle" dominant-baseline="central">
    <text x="${cx}" y="${cy}">♥</text>
  </g>
</svg>`;
}

function monoCard(s) {
  const c = s * 0.76;
  const pad = s * 0.12;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect x="${pad}" y="${pad}" width="${c}" height="${c}" rx="${c * 0.08}" fill="white" />
</svg>`;
}

async function gen(name, svgFn, size, dest) {
  const svg = svgFn(size);
  const buf = Buffer.from(svg);
  await sharp(buf).resize(size, size).png().toFile(path.join(ASSETS, dest || name));
  console.log(`  ${dest || name} (${size}x${size})`);
}

async function main() {
  console.log('Generating card suit icons...');
  await gen('icon.png', s => cardSVG(s, 48), 1024, 'icon.png');
  await gen('adaptive-fg.png', cardFG, 1024, 'android-icon-foreground.png');
  await gen('splash.png', s => cardSVG(s, 8), 128, 'splash-icon.png');
  await gen('monochrome.png', monoCard, 1024, 'android-icon-monochrome.png');
  await gen('favicon.png', s => cardSVG(s, 4), 48, 'favicon.png');
  console.log('Done!');
}

main().catch(console.error);
