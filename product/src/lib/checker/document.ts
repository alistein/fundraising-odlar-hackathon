// Document forgery signals from the file itself: no network, no model.
// These are tamper *signals*, not proof — a clean result means "nothing found".

export type DocType = "pdf" | "jpeg" | "png";

export type DocReport = {
  type: DocType | null;
  signals: string[];
  /** False when an image carries no EXIF/XMP at all: messengers strip it, so origin cannot be checked. */
  hasMetadata: boolean;
};

const EDITORS: [RegExp, string][] = [
  [/photoshop/i, "Adobe Photoshop"],
  [/illustrator/i, "Adobe Illustrator"],
  [/\bgimp\b/i, "GIMP"],
  [/canva/i, "Canva"],
  [/inkscape/i, "Inkscape"],
  [/coreldraw/i, "CorelDRAW"],
  [/pixelmator/i, "Pixelmator"],
  [/affinity (photo|designer|publisher)/i, "Affinity"],
  [/ilovepdf/i, "iLovePDF"],
  [/sejda/i, "Sejda"],
  [/pdfescape/i, "PDFescape"],
  [/smallpdf/i, "Smallpdf"],
  [/pdf-?xchange/i, "PDF-XChange"],
  [/phantompdf/i, "Foxit PhantomPDF"],
];

const AI_MARKS =
  /midjourney|dall[-·. ]?e|stable diffusion|adobe firefly|openai|chatgpt|gpt-4o|gpt-image|google imagen|trainedalgorithmicmedia|c2pa|jumbf/i;

export function detectType(buf: Buffer): DocType | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).toString("latin1") === "\x89PNG\r\n\x1a\n") return "png";
  return null;
}

// PDF dates look like D:20261117143000+04'00'
function pdfDate(raw: string | undefined): number | null {
  const m = raw?.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
  if (!m) return null;
  const [y, mo, d, h = "0", mi = "0", s = "0"] = m.slice(1);
  return Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
}

export function inspectDocument(buf: Buffer): DocReport {
  const type = detectType(buf);
  if (!type) return { type, signals: [], hasMetadata: false };

  // Metadata is ASCII in the cases we look for; latin1 keeps byte offsets intact.
  const text = buf.toString("latin1");
  const signals: string[] = [];

  // Where the file says it came from: PDF Info dictionary, or the first 256 KB of an image (EXIF/XMP).
  const meta =
    type === "pdf"
      ? [...text.matchAll(/\/(?:Producer|Creator)\s*\(([^)]{0,200})\)/g)].map((m) => m[1]).join(" ")
      : text.slice(0, 256 * 1024);

  const editor = EDITORS.find(([re]) => re.test(meta));
  if (editor) signals.push(`Redaktə proqramının izi: ${editor[1]}`);
  // Content-credential (C2PA) manifests can sit anywhere in the file, so scan all of it.
  if (AI_MARKS.test(text)) signals.push("Süni intellektlə yaradılma izi");
  const hasMetadata = type === "pdf" || /Exif\0|<x:xmpmeta|ICC_PROFILE|tEXt|iTXt/.test(text);

  if (type === "pdf") {
    const created = pdfDate(text.match(/\/CreationDate\s*\(([^)]*)\)/)?.[1]);
    const modified = pdfDate([...text.matchAll(/\/ModDate\s*\(([^)]*)\)/g)].at(-1)?.[1]);
    if (created && modified && modified - created > 60_000)
      signals.push("Sənəd yaradıldıqdan sonra dəyişdirilib");

    // Each save-on-top appends a new section ending in %%EOF. Linearized
    // ("fast web view") files legitimately have two.
    const saves = text.split("%%EOF").length - 1;
    if (saves > (/\/Linearized/.test(text) ? 2 : 1))
      signals.push("Sənədin üzərinə sonradan əlavə yazılıb");
  }

  return { type, signals, hasMetadata };
}
