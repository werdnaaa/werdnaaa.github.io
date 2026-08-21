import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg');

// Flatten the media query for raster output: PNGs cannot adapt, so bake the
// dark-square / light-letter version, which reads correctly on both themes.
const solid = svg
  .toString()
  .replace(/@media \(prefers-color-scheme: dark\) \{[^}]*\}[^}]*\}/s, '');

const png = (size) =>
  sharp(Buffer.from(solid), { density: 384 }).resize(size, size).png().toBuffer();

// Apple touch icon needs an opaque, non-rounded field — iOS masks it itself.
const appleIcon = solid.replace('rx="14"', 'rx="0"');

const [i16, i32, i48, i180, i192, i512] = await Promise.all([
  png(16), png(32), png(48),
  sharp(Buffer.from(appleIcon), { density: 384 }).resize(180, 180).png().toBuffer(),
  png(192), png(512),
]);

// Nav logo: rendered at 3x its display height so it stays crisp on retina
// without shipping the multi-hundred-KB source SVG on every page.
const navLogo = await sharp(Buffer.from(solid), { density: 384 })
  .resize({ height: 96 })
  .png({ compressionLevel: 9 })
  .toBuffer();
const navMeta = await sharp(navLogo).metadata();
writeFileSync('public/logo.png', navLogo);

writeFileSync('public/apple-touch-icon.png', i180);
writeFileSync('public/icon-192.png', i192);
writeFileSync('public/icon-512.png', i512);

// Assemble a multi-resolution .ico. The format is a 6-byte header, then one
// 16-byte directory entry per image, then the image payloads. PNG payloads are
// valid inside ICO and understood by every browser we care about.
const images = [
  { size: 16, data: i16 },
  { size: 32, data: i32 },
  { size: 48, data: i48 },
];

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(images.length, 4);

let offset = 6 + images.length * 16;
const entries = [];
for (const img of images) {
  const e = Buffer.alloc(16);
  e.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width
  e.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
  e.writeUInt8(0, 2);  // palette count
  e.writeUInt8(0, 3);  // reserved
  e.writeUInt16LE(1, 4);  // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.data.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += img.data.length;
}

writeFileSync(
  'public/favicon.ico',
  Buffer.concat([header, ...entries, ...images.map((i) => i.data)]),
);

console.log(
  `wrote favicon.ico (16/32/48), apple-touch-icon.png, icon-192.png, ` +
    `icon-512.png, logo.png (${navMeta.width}x${navMeta.height})`,
);
