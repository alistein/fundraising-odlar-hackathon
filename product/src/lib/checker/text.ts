// Pure text helpers for the scam checker: no database, no network.

/** Lowercase, fold Azerbaijani letters to ASCII, keep letters and digits only. */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type Identifiers = {
  cards: string[]; // 16 digits
  ibans: string[];
  codes: string[]; // SF-1234
  docCodes: string[]; // SD-123456, a clinic-confirmed document
  campaignIds: string[]; // from /campaigns/<id> links
  amountsAzn: number[];
};

const CARD = /(?<!\d)(?:\d[ -]?){15}\d(?!\d)/g;
const IBAN = /\bAZ\d{2}[A-Z]{4}[A-Z0-9]{20}\b/gi;
const CODE = /\bSF[- ]?(\d{4})\b/gi;
const DOC_CODE = /\bSD[- ]?(\d{6})\b/gi;
const LINK = /\/campaigns\/([\w-]+)/g;
const AMOUNT = /(\d{1,3}(?:[ .,]\d{3})+|\d+)\s*(?:azn|₼|manat)/gi;

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export function extractIdentifiers(text: string): Identifiers {
  const ibans = uniq([...text.matchAll(IBAN)].map((m) => m[0].toUpperCase()));
  const withoutIbans = text.replace(IBAN, " ");
  return {
    cards: uniq([...withoutIbans.matchAll(CARD)].map((m) => m[0].replace(/\D/g, ""))),
    ibans,
    codes: uniq([...text.matchAll(CODE)].map((m) => `SF-${m[1]}`)),
    docCodes: uniq([...text.matchAll(DOC_CODE)].map((m) => `SD-${m[1]}`)),
    campaignIds: uniq([...text.matchAll(LINK)].map((m) => m[1])),
    amountsAzn: [...withoutIbans.replace(CARD, " ").matchAll(AMOUNT)].map((m) =>
      Number(m[1].replace(/[ .,]/g, "")),
    ),
  };
}

/**
 * Story fingerprint: significant words cut to a 5-letter stem, so suffixes
 * ("Əlinin" / "Əliyə") and small rewrites still match. Numbers, links and
 * payment details are removed first — a clone changes exactly those.
 */
export function storyTokens(text: string): string[] {
  const stripped = text
    .replace(/https?:\/\/\S+/g, " ")
    .replace(IBAN, " ")
    .replace(CODE, " ")
    .replace(DOC_CODE, " ");
  return uniq(
    normalise(stripped)
      .split(" ")
      .filter((w) => w.length >= 4 && !/\d/.test(w))
      .map((w) => w.slice(0, 5)),
  );
}

/** Share of `needle` tokens that appear in `haystack` (0..1). */
export function containment(needle: string[], haystack: string[]): number {
  if (needle.length === 0) return 0;
  const set = new Set(haystack);
  return needle.filter((t) => set.has(t)).length / needle.length;
}

export function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const set = new Set(b);
  const shared = a.filter((t) => set.has(t)).length;
  return shared / (a.length + b.length - shared);
}

/** True when two fingerprints are the same story. Too-short texts never match. */
export function sameStory(a: string[], b: string[]): boolean {
  return a.length >= 5 && b.length >= 5 && jaccard(a, b) >= 0.5;
}

/** Number of distinct stories in a list of fingerprints (greedy clustering). */
export function countStories(fingerprints: string[][]): number {
  const reps: string[][] = [];
  for (const f of fingerprints) {
    if (f.length < 5) continue;
    if (!reps.some((r) => sameStory(r, f))) reps.push(f);
  }
  return reps.length;
}

/** Patient's first name and the diagnosis both appear in the text. */
export function entityMatch(text: string, patientName: string, diagnosis: string): boolean {
  const words = normalise(text).split(" ");
  const first = normalise(patientName).split(" ")[0];
  if (!first || first.length < 3) return false;
  const nameHit = words.some((w) => w.startsWith(first) && w.length <= first.length + 4);
  const diag = storyTokens(diagnosis);
  return nameHit && diag.length > 0 && containment(diag, storyTokens(text)) >= 0.6;
}
