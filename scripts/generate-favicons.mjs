#!/usr/bin/env node
/**
 * generate-favicons.mjs — PANEL-FAVICON-BRAND
 *
 * Генерирует полный набор бренд-favicon из site/public/favicon.svg:
 *   - site/app/favicon.ico        (multi-resolution 16/32/48, embedded PNGs)
 *   - site/public/apple-touch-icon.png  (180×180)
 *   - site/public/icon-192.png    (192×192, PWA / Android Chrome)
 *   - site/public/icon-512.png    (512×512, PWA splash)
 *
 * Source SVG = упрощённый mark-simple из §3 brand-guide (master лежит в
 * agents/brand/logo/mark-simple.svg, viewBox 256; этот файл — viewBox 32 для
 * читаемости @ 16×16 в браузерной вкладке).
 *
 * Запуск (sharp находится в site/node_modules):
 *   cd /Users/a36/obikhod/site && node ../scripts/generate-favicons.mjs
 *
 * Зависимости: sharp@^0.34 (уже установлен в site/node_modules).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// sharp устанавливается в site/node_modules (а не в корне monorepo) — резолвим
// явным file URL чтобы можно было запускать скрипт из любого cwd.
const sharpUrl = pathToFileURL(resolve(root, 'site/node_modules/sharp/lib/index.js')).href;
const { default: sharp } = await import(sharpUrl);
const svgPath = resolve(root, 'site/public/favicon.svg');
const svg = await readFile(svgPath);

// density 384 — даёт чёткий растеризатор для 512×512 без алиасинга на мелких.
const density = 384;

// PNG raster
await sharp(svg, { density })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'site/public/apple-touch-icon.png'));

await sharp(svg, { density })
  .resize(192, 192)
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'site/public/icon-192.png'));

await sharp(svg, { density })
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'site/public/icon-512.png'));

// ICO multi-resolution (16/32/48), PNG-encoded payloads (PNG-in-ICO is widely
// supported by all browsers since ~2010). Pure-JS encoder, no external deps.
const sizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  sizes.map((s) =>
    sharp(svg, { density })
      .resize(s, s)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = ICO
header.writeUInt16LE(sizes.length, 4); // image count

const directory = Buffer.alloc(16 * sizes.length);
let offset = 6 + 16 * sizes.length;
for (let i = 0; i < sizes.length; i++) {
  const s = sizes[i];
  const buf = pngBuffers[i];
  const base = i * 16;
  directory.writeUInt8(s === 256 ? 0 : s, base + 0); // width (0 = 256)
  directory.writeUInt8(s === 256 ? 0 : s, base + 1); // height
  directory.writeUInt8(0, base + 2); // color count (0 = ≥256)
  directory.writeUInt8(0, base + 3); // reserved
  directory.writeUInt16LE(1, base + 4); // color planes
  directory.writeUInt16LE(32, base + 6); // bits per pixel
  directory.writeUInt32LE(buf.length, base + 8); // size of image data
  directory.writeUInt32LE(offset, base + 12); // offset of image data
  offset += buf.length;
}

const ico = Buffer.concat([header, directory, ...pngBuffers]);
await writeFile(resolve(root, 'site/app/favicon.ico'), ico);

console.log('✓ Generated favicon set:');
console.log('  • site/app/favicon.ico (16/32/48, %d bytes)', ico.length);
console.log('  • site/public/apple-touch-icon.png (180×180)');
console.log('  • site/public/icon-192.png (192×192)');
console.log('  • site/public/icon-512.png (512×512)');
