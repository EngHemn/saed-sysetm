const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outputDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outputDir, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPng(width, height, isMaskable = false) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = writeChunk('IHDR', ihdrData);

  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.min(width, height) / 2;
  const margin = isMaskable ? width * 0.1 : width * 0.04;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Default background: #09090b
      let r = 9, g = 9, b = 11, a = 255;

      const inBox = x >= margin && x < width - margin && y >= margin && y < height - margin;

      if (inBox) {
        // Inner card color: #18181b
        r = 24; g = 24; b = 27;

        const borderDist = Math.min(
          x - margin, width - margin - x,
          y - margin, height - margin - y
        );
        if (borderDist < Math.max(1, width * 0.015)) {
          r = 234; g = 179; b = 8; // Gold
        }

        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const ringR = maxR * 0.45;
        const ringThickness = maxR * 0.07;
        if (Math.abs(dist - ringR) < ringThickness) {
          r = 234; g = 179; b = 8;
        }

        const diamondSize = maxR * 0.2;
        if (Math.abs(dx) + Math.abs(dy) < diamondSize) {
          r = 250; g = 250; b = 250;
        }

        if (dist > ringR * 0.5 && dist < ringR * 1.3) {
          if (dy < 0 && dx > -ringR * 0.6 && dx < ringR * 0.6 && Math.abs(dist - ringR * 0.85) < maxR * 0.05) {
            r = 234; g = 179; b = 8;
          }
          if (dy > 0 && dx > -ringR * 0.6 && dx < ringR * 0.6 && Math.abs(dist - ringR * 0.85) < maxR * 0.05) {
            r = 234; g = 179; b = 8;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = writeChunk('IDAT', compressedData);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

for (const s of sizes) {
  const png = createPng(s, s, false);
  const fileName = (s === 180) ? 'apple-touch-icon.png' : `icon-${s}x${s}.png`;
  fs.writeFileSync(path.join(outputDir, fileName), png);
  console.log(`Saved ${fileName}`);
}

for (const s of [192, 512]) {
  const png = createPng(s, s, true);
  const fileName = `icon-maskable-${s}x${s}.png`;
  fs.writeFileSync(path.join(outputDir, fileName), png);
  console.log(`Saved ${fileName}`);
}

console.log('All PWA icons generated successfully!');
