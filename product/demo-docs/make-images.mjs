// Builds the image samples for the pixel-forensics demo from clean-invoice.png
// and forged-invoice.png (both synthetic).   node demo-docs/make-images.mjs
//
// forged-invoice.jpg  a JPEG of the clean invoice with the edited total pasted
//                     in afterwards: the paste has a different compression history
// photo-forged.png    the clean invoice with simulated camera noise, and a
//                     noise-free patch pasted over the total
// clean-invoice.jpg   the clean invoice saved once, for comparison
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const at = (f) => path.join(here, f);
const raw = (f) => sharp(at(f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });

const clean = await raw("clean-invoice.png");
const forged = await raw("forged-invoice.png");
const { width: w, height: h } = clean.info;

// Bounding box of what the forger changed.
let x0 = w, y0 = h, x1 = 0, y1 = 0;
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const p = (y * w + x) * 3;
    if (Math.abs(clean.data[p] - forged.data[p]) > 24) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
// The edit moves the rows below it by a pixel, so the difference spans the
// table's width. The forger only pastes the total: keep the right-hand end.
const box = { left: Math.max(0, x1 - 100), top: Math.max(0, y0 - 4), width: 0, height: 0 };
box.width = Math.min(w, x1 + 6) - box.left;
box.height = Math.min(h, y0 + 34) - box.top;
const patch = await sharp(at("forged-invoice.png")).extract(box).png().toBuffer();

await sharp(at("clean-invoice.png")).jpeg({ quality: 70 }).toFile(at("clean-invoice.jpg"));

// The original was saved at low quality (a forwarded photo); the forger pastes and saves at high quality.
await sharp(await sharp(at("clean-invoice.png")).jpeg({ quality: 55 }).toBuffer())
  .composite([{ input: patch, left: box.left, top: box.top }])
  .jpeg({ quality: 95 })
  .toFile(at("forged-invoice.jpg"));

// Simulated photograph: off-white paper with sensor noise everywhere, then a clean paste.
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd());
const noisy = Buffer.alloc(clean.data.length);
for (let i = 0; i < clean.data.length; i += 3) {
  const n = gauss() * 4;
  for (let c = 0; c < 3; c++)
    noisy[i + c] = Math.max(0, Math.min(255, clean.data[i + c] * 0.93 + n));
}
// Grey rectangle around the pasted total, kept inside the page.
const pad = { left: Math.max(0, box.left - 35), top: Math.max(0, box.top - 13) };
pad.width = Math.min(w - pad.left, box.width + 70);
pad.height = Math.min(h - pad.top, box.height + 26);
const flatPatch = await sharp({
  create: { width: pad.width, height: pad.height, channels: 3, background: { r: 237, g: 237, b: 237 } },
})
  .composite([{ input: patch, left: box.left - pad.left, top: box.top - pad.top }])
  .png()
  .toBuffer();
await sharp(noisy, { raw: { width: w, height: h, channels: 3 } })
  .composite([{ input: flatPatch, left: pad.left, top: pad.top }])
  .png()
  .toFile(at("photo-forged.png"));

console.log("patch", box);
