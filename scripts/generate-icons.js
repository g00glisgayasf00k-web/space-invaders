// Generates PWA icons without external dependencies (PNG via minimal BMP-like approach)
// Uses pure Node to write simple PNG files with pngjs alternative - canvas not available
// Fallback: write SVG and note user can convert; we'll use a tiny PNG encoder inline.

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  let c = 0xffffffff;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c;
    }
    return t;
  })());
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  const crcData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(crcData));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPNG(size) {
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const cx = size / 2, cy = size / 2;
      const inShip = (
        (y > size * 0.55 && y < size * 0.72 && x > size * 0.2 && x < size * 0.8) ||
        (y > size * 0.45 && y < size * 0.58 && x > size * 0.35 && x < size * 0.65) ||
        (y > size * 0.38 && y < size * 0.48 && x > size * 0.46 && x < size * 0.54)
      );
      const isStar = ((x * 7 + y * 13) % 17 === 0) && y < size * 0.4;
      if (inShip) {
        pixels[i] = 255; pixels[i + 1] = 255; pixels[i + 2] = 0; pixels[i + 3] = 255;
      } else if (isStar) {
        pixels[i] = 100; pixels[i + 1] = 100; pixels[i + 2] = 100; pixels[i + 3] = 255;
      } else {
        pixels[i] = 0; pixels[i + 1] = 0; pixels[i + 2] = 0; pixels[i + 3] = 255;
      }
    }
  }

  const raw = Buffer.alloc(size * (1 + size * 4));
  let offset = 0;
  for (let y = 0; y < size; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      raw[offset++] = pixels[i];
      raw[offset++] = pixels[i + 1];
      raw[offset++] = pixels[i + 2];
      raw[offset++] = pixels[i + 3];
    }
  }

  const compressed = zlib.deflateSync(raw);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const iconsDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPNG(512));
console.log('Icons written to icons/');
