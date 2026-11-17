// Pixel forensics for uploaded images: no model, no network.
//
// Compression history ("JPEG ghost"): a JPEG remembers the quality it was last
// saved at. Save it again at that same quality and it barely changes; at any
// other quality it changes more. So we re-save the picture at a ladder of
// qualities and watch each block. If most of the page shows a dip at one
// quality, the page was a JPEG before. A compact area with no dip was not part
// of that JPEG: it was pasted in afterwards.
//
// Noise check: a photograph of paper has sensor noise across every plain area.
// A digitally pasted patch has none.
//
// Both find *edits to an existing picture*. Neither can tell that a whole image
// was generated, and both weaken each time a messenger recompresses the file.
import sharp from "sharp";
import type { DocType } from "./document";

export type Forensics = {
  signals: string[];
  /** JPEG data URL: the image dimmed, with the suspicious area in red. Null when nothing stands out. */
  heatmap: string | null;
};

const BLOCK = 16;
const MAX_PIXELS = 16_000_000;
const LADDER = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

type Grid = { cols: number; rows: number };

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[s.length >> 1];
}

/** Where a set of blocks sits, in words a donor can check against the picture. */
function locate(blocks: number[], g: Grid): string {
  const x = blocks.reduce((n, b) => n + (b % g.cols), 0) / blocks.length / g.cols;
  const y = blocks.reduce((n, b) => n + Math.floor(b / g.cols), 0) / blocks.length / g.rows;
  const v = y < 0.34 ? "yuxarı" : y > 0.66 ? "aşağı" : "orta";
  const h = x < 0.34 ? "sol" : x > 0.66 ? "sağ" : "mərkəz";
  return `${v} ${h}`;
}

/** Largest group of flagged blocks that touch each other (8-neighbourhood). */
function largestCluster(flagged: Set<number>, g: Grid): number[] {
  const seen = new Set<number>();
  let best: number[] = [];
  for (const start of flagged) {
    if (seen.has(start)) continue;
    const group: number[] = [];
    const stack = [start];
    seen.add(start);
    while (stack.length) {
      const b = stack.pop()!;
      group.push(b);
      const bx = b % g.cols;
      const by = Math.floor(b / g.cols);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = bx + dx;
          const ny = by + dy;
          if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
          const n = ny * g.cols + nx;
          if (flagged.has(n) && !seen.has(n)) {
            seen.add(n);
            stack.push(n);
          }
        }
    }
    if (group.length > best.length) best = group;
  }
  return best;
}

export async function analyseImage(buf: Buffer, type: DocType): Promise<Forensics | null> {
  if (type === "pdf") return null;
  try {
    const { data, info } = await sharp(buf)
      .removeAlpha()
      .toColourspace("srgb")
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;
    if (ch !== 3 || w * h > MAX_PIXELS || w < BLOCK * 4 || h < BLOCK * 4) return null;

    const g: Grid = { cols: Math.floor(w / BLOCK), rows: Math.floor(h / BLOCK) };
    const n = g.cols * g.rows;

    // Luma, for detail and noise.
    const luma = new Float32Array(w * h);
    for (let i = 0, p = 0; i < w * h; i++, p += 3)
      luma[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];

    const detail = new Float32Array(n); // mean gradient: is there anything in the block
    const spread = new Float32Array(n); // luma standard deviation
    const level = new Float32Array(n); // mean brightness
    for (let by = 0; by < g.rows; by++)
      for (let bx = 0; bx < g.cols; bx++) {
        let d = 0;
        let sum = 0;
        let sq = 0;
        for (let y = by * BLOCK; y < (by + 1) * BLOCK; y++)
          for (let x = bx * BLOCK; x < (bx + 1) * BLOCK; x++) {
            const i = y * w + x;
            if (x + 1 < w) d += Math.abs(luma[i] - luma[i + 1]);
            if (y + 1 < h) d += Math.abs(luma[i] - luma[i + w]);
            sum += luma[i];
            sq += luma[i] * luma[i];
          }
        const count = BLOCK * BLOCK;
        const b = by * g.cols + bx;
        detail[b] = d / count;
        level[b] = sum / count;
        spread[b] = Math.sqrt(Math.max(0, sq / count - (sum / count) ** 2));
      }

    const signals: string[] = [];
    let marked: number[] = [];

    // ── Compression history: only a JPEG has one.
    if (type === "jpeg") {
      const content = [...Array(n).keys()].filter((b) => detail[b] > 3);
      if (content.length >= 20) {
        // Squared change of every content block at each rung of the ladder.
        const curves = new Map<number, number[]>(content.map((b) => [b, []]));
        for (const q of LADDER) {
          const re = await sharp(
            await sharp(data, { raw: { width: w, height: h, channels: 3 } })
              .jpeg({ quality: q })
              .toBuffer(),
          )
            .raw()
            .toBuffer();
          for (const b of content) {
            const bx = b % g.cols;
            const by = Math.floor(b / g.cols);
            let e = 0;
            for (let y = by * BLOCK; y < (by + 1) * BLOCK; y++)
              for (let x = bx * BLOCK; x < (bx + 1) * BLOCK; x++) {
                const i = y * w + x;
                const p = i * 3;
                e += (luma[i] - (0.299 * re[p] + 0.587 * re[p + 1] + 0.114 * re[p + 2])) ** 2;
              }
            curves.get(b)!.push(e / (BLOCK * BLOCK));
          }
        }

        // The rung where a block dips below what follows it, or -1 for a smooth slope.
        const dipOf = (c: number[]): number => {
          let best = -1;
          let depth = 0.7; // must be at least 30% below the rungs after it
          for (let i = 0; i < c.length - 2; i++) {
            const after = Math.max(c[i + 1], c[i + 2]);
            if (after < 2) continue; // too little change to read
            if (c[i] / after < depth) {
              depth = c[i] / after;
              best = i;
            }
          }
          return best;
        };
        const dips = new Map(content.map((b) => [b, dipOf(curves.get(b)!)]));
        const votes = new Array(LADDER.length).fill(0);
        for (const d of dips.values()) if (d >= 0) votes[d]++;
        const rung = votes.indexOf(Math.max(...votes));
        const agree = (d: number) => Math.abs(d - rung) <= 1;
        const withHistory = content.filter((b) => agree(dips.get(b)!));

        // Only meaningful when the page as a whole clearly was a JPEG before.
        if (withHistory.length >= content.length * 0.6) {
          const without = content.filter((b) => {
            const c = curves.get(b)!;
            return dips.get(b)! < 0 && c[rung] > 20; // changes a lot exactly where the page does not
          });
          const cluster = largestCluster(new Set(without), g);
          if (cluster.length >= 3 && cluster.length <= content.length * 0.2) {
            marked = cluster;
            signals.push(
              `Şəklin ${locate(cluster, g)} hissəsinin sıxılma tarixçəsi fərqlidir (sonradan əlavə əlaməti)`,
            );
          }
        }
      }
    }

    // ── Noise: a dead-still patch inside a photograph that is grainy everywhere else.
    // Plain areas only (no text), and not blown-out white or black, which are still for honest reasons.
    const plain = [...Array(n).keys()].filter(
      (b) => spread[b] < 12 && level[b] > 8 && level[b] < 247,
    );
    if (plain.length >= 40) {
      const typical = median(plain.map((b) => spread[b]));
      if (typical > 1.5) {
        const cluster = largestCluster(new Set(plain.filter((b) => spread[b] < typical * 0.25)), g);
        if (cluster.length >= 3 && cluster.length <= plain.length * 0.15) {
          if (marked.length === 0) marked = cluster;
          signals.push(`Şəklin ${locate(cluster, g)} hissəsində kamera küyü yoxdur`);
        }
      }
    }

    if (signals.length === 0) return { signals, heatmap: null };

    // Heatmap: the picture dimmed to grey, flagged blocks in red.
    const hot = new Set(marked);
    const out = Buffer.alloc(w * h * 3);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const b = Math.min(g.rows - 1, Math.floor(y / BLOCK)) * g.cols + Math.min(g.cols - 1, Math.floor(x / BLOCK));
        const grey = 255 - (255 - luma[i]) * 0.45;
        const on = hot.has(b);
        out[i * 3] = on ? 255 : grey;
        out[i * 3 + 1] = on ? grey * 0.45 : grey;
        out[i * 3 + 2] = on ? grey * 0.4 : grey;
      }
    const jpeg = await sharp(out, { raw: { width: w, height: h, channels: 3 } })
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();
    return { signals, heatmap: `data:image/jpeg;base64,${jpeg.toString("base64")}` };
  } catch (e) {
    console.warn("checker forensics: failed", e);
    return null;
  }
}
