// Where did this image come from? Measured from the pixels, no model.
//
// We cannot prove "an AI made this" from pixels once a messenger has
// recompressed the file. What we can measure is the opposite: whether the
// picture carries the marks of a camera. A photograph of a paper document has
// sensor grain in every plain area and uneven light across the page. A page
// that was rendered — exported from software, drawn by a generator — has plain
// areas that are perfectly still.
//
// LIMIT, found in testing: this cannot clear a picture. A Gemini-generated
// "photo of a document held in a hand" has grain, uneven light and a 3:4 frame,
// and is classified "camera" here. So "camera" earns no trust; only "digital"
// carries information (a claimed paper document that was never photographed).
//
// So this answers "was this rendered rather than photographed?", not "is this AI?".
// A clinic's own PDF export is also "digital"; that alone is not an accusation.
//
// Thresholds were set on a handful of samples (three phone photos, three
// screenshots, three digital pages, one generated document, all forwarded
// through WhatsApp). Treat them as a starting point, not a calibrated detector.
import sharp from "sharp";
import type { DocType } from "./document";

export type Origin = "camera" | "scan" | "screenshot" | "digital" | "unknown";

export type OriginReport = {
  origin: Origin;
  /** Square pictures: no phone camera or scanner produces them, generators do. */
  square: boolean;
  /** What was measured, in the checker's wording. */
  evidence: string[];
};

const BLOCK = 16;

const LABEL: Record<Origin, string> = {
  camera: "Kamera fotosuna oxşayır",
  scan: "Skana oxşayır",
  screenshot: "Mənşə: ekran görüntüsü",
  digital: "Mənşə: rəqəmsal yaradılmış şəkil, kağızın fotosu deyil",
  unknown: "Mənşə müəyyən olunmadı",
};

const near = (a: number, b: number, tol = 0.012) => Math.abs(a - b) <= tol;

export async function classifyOrigin(buf: Buffer, type: DocType): Promise<OriginReport | null> {
  if (type === "pdf") return null;
  try {
    const [{ data, info }, blurred] = await Promise.all([
      sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true }),
      sharp(buf).greyscale().blur(1).raw().toBuffer(),
    ]);
    const { width: w, height: h } = info;
    if (w < BLOCK * 8 || h < BLOCK * 8) return null;

    // Plain blocks only (no text or edges in them): that is where grain shows.
    const grain: number[] = [];
    const levels: number[] = [];
    let still = 0;
    for (let by = 0; by + BLOCK <= h; by += BLOCK)
      for (let bx = 0; bx + BLOCK <= w; bx += BLOCK) {
        let lo = 255;
        let hi = 0;
        let sum = 0;
        let sq = 0;
        let level = 0;
        for (let y = by; y < by + BLOCK; y++)
          for (let x = bx; x < bx + BLOCK; x++) {
            const i = y * w + x;
            const v = data[i];
            const r = v - blurred[i]; // what is left after smoothing: the grain
            if (v < lo) lo = v;
            if (v > hi) hi = v;
            sum += r;
            sq += r * r;
            level += v;
          }
        if (hi - lo >= 28) continue;
        const n = BLOCK * BLOCK;
        const sd = Math.sqrt(Math.max(0, sq / n - (sum / n) ** 2));
        grain.push(sd);
        levels.push(level / n);
        if (sd < 0.15) still++;
      }
    if (grain.length < 30) return { origin: "unknown", square: false, evidence: [LABEL.unknown] };

    const sorted = [...grain].sort((a, b) => a - b);
    const noise = sorted[sorted.length >> 1];
    const stillShare = still / grain.length;
    const mean = levels.reduce((a, v) => a + v, 0) / levels.length;
    const light = Math.sqrt(levels.reduce((a, v) => a + (v - mean) ** 2, 0) / levels.length);
    const ratio = Math.min(w, h) / Math.max(w, h);
    const square = near(ratio, 1);
    const a4 = near(ratio, 0.7071);
    const sensor = near(ratio, 0.75) || near(ratio, 0.5625) || near(ratio, 0.6667);

    const pct = (x: number) => `${Math.round(x * 100)}%`;
    let origin: Origin;
    const evidence: string[] = [];

    if (stillShare < 0.15 && noise >= 0.25) {
      // Grain everywhere: something optical recorded this.
      if (light >= 8 || sensor) {
        origin = "camera";
        evidence.push("Hamar sahələrdə sensor küyü var", "İşıqlanma səhifə boyu qeyri-bərabərdir");
        if (sensor) evidence.push(`Nisbət kamera sensoruna uyğundur (${ratio.toFixed(2)})`);
      } else {
        origin = "scan";
        evidence.push("Hamar sahələrdə bərabər küy var", "İşıqlanma bərabərdir");
      }
    } else if (stillShare >= 0.35) {
      // Plain areas that do not move at all were rendered, not photographed.
      const share = `Hamar sahələrin ${pct(stillShare)}-i tam küysüzdür`;
      if (ratio <= 0.58) {
        origin = "screenshot";
        evidence.push(share, `Nisbət telefon ekranına uyğundur (${ratio.toFixed(2)})`);
      } else {
        origin = "digital";
        evidence.push(share);
        if (a4) evidence.push(`Nisbət A4 səhifəsinə uyğundur (${ratio.toFixed(2)}); telefon kamerası 0.75 verir`);
        if (square) evidence.push("Kvadrat şəkil: telefon kamerası və skaner belə ölçü vermir");
      }
    } else {
      origin = "unknown";
    }

    return { origin, square, evidence: [LABEL[origin], ...evidence] };
  } catch (e) {
    console.warn("checker origin: failed", e);
    return null;
  }
}
