/* make-icons.mjs :: writes assets/icons/icon-192.png and icon-512.png.
 *
 * Run once (node tools/make-icons.mjs). The PNGs are committed, so the app never
 * needs this at runtime. Raw PNG encoder because pulling an image library in for
 * two flat-colour squares is not worth the dependency.
 *
 * The mark: three rising bars (progress) in amber on the app's dark background.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'assets', 'icons');

const BG = [15, 18, 24];        // #0f1218
const FG = [255, 184, 77];      // #ffb84d
const FG2 = [79, 209, 197];     // #4fd1c5

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  // RGB, 8-bit, no filter. One extra leading byte per scanline (filter type 0).
  const stride = size * 3 + 1;
  const raw = Buffer.alloc(stride * size);

  const r = Math.round(size * 0.18);          // corner radius
  const bars = [                              // x, width, height as fractions
    { x: 0.20, w: 0.16, h: 0.30, c: FG2 },
    { x: 0.42, w: 0.16, h: 0.50, c: FG },
    { x: 0.64, w: 0.16, h: 0.70, c: FG }
  ];

  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < size; x++) {
      let col = BG;

      // rounded-corner mask: outside the rounded square stays transparent-ish
      // (no alpha channel here, so just paint it background)
      const cx = Math.min(x, size - 1 - x), cy = Math.min(y, size - 1 - y);
      const inCorner = cx < r && cy < r && ((r - cx) ** 2 + (r - cy) ** 2) > r * r;

      if (!inCorner) {
        for (const b of bars) {
          const bx0 = Math.round(b.x * size), bx1 = Math.round((b.x + b.w) * size);
          const by1 = Math.round(size * 0.80), by0 = Math.round(by1 - b.h * size);
          if (x >= bx0 && x < bx1 && y >= by0 && y < by1) { col = b.c; break; }
        }
      }

      const o = y * stride + 1 + x * 3;
      raw[o] = col[0]; raw[o + 1] = col[1]; raw[o + 2] = col[2];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 2;    // colour type 2 = truecolour RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

mkdirSync(OUT, { recursive: true });
for (const size of [192, 512]) {
  const file = join(OUT, `icon-${size}.png`);
  writeFileSync(file, png(size));
  console.log('wrote', file);
}
