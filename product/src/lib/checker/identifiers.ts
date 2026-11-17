// Check digits of official numbers printed on a document. Pure arithmetic.
//
// A generator draws a seal that looks right and fills it with digits that look
// right. Real registry numbers carry a check digit; invented ones fail it nine
// times out of ten. This is the one test a photorealistic fake cannot pass by
// looking good.
//
// Covered: Russian OGRN / OGRNIP and INN, any IBAN (including AZ), payment
// card numbers. Not covered: Azerbaijani VÖEN and clinic licence numbers — we
// have no verified check-digit rule for them, so they are left unjudged rather
// than guessed at.

export type IdKind = "ogrn" | "inn" | "iban" | "card" | "other";
export type IdCheck = "valid" | "invalid" | "unknown";

export const ID_LABEL: Record<IdKind, string> = {
  ogrn: "ОГРН",
  inn: "ИНН",
  iban: "IBAN",
  card: "Kart",
  other: "Nömrə",
};

const digits = (s: string) => s.replace(/\D/g, "");

function mod(numeric: string, m: number): number {
  let r = 0;
  for (const ch of numeric) r = (r * 10 + (ch.charCodeAt(0) - 48)) % m;
  return r;
}

function ogrn(v: string): IdCheck {
  const d = digits(v);
  if (d.length === 13) return (mod(d.slice(0, 12), 11) % 10) === +d[12] ? "valid" : "invalid";
  if (d.length === 15) return (mod(d.slice(0, 14), 13) % 10) === +d[14] ? "valid" : "invalid";
  return "unknown"; // wrong length is more likely a misread than a forgery
}

function inn(v: string): IdCheck {
  const d = digits(v);
  const check = (weights: number[]) =>
    (weights.reduce((sum, w, i) => sum + w * +d[i], 0) % 11) % 10;
  if (d.length === 10) return check([2, 4, 10, 3, 5, 9, 4, 6, 8]) === +d[9] ? "valid" : "invalid";
  if (d.length === 12)
    return check([7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === +d[10] &&
      check([3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === +d[11]
      ? "valid"
      : "invalid";
  return "unknown";
}

function iban(v: string): IdCheck {
  const s = v.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return "unknown";
  const moved = s.slice(4) + s.slice(0, 4);
  const numeric = [...moved].map((c) => (c >= "A" ? String(c.charCodeAt(0) - 55) : c)).join("");
  return mod(numeric, 97) === 1 ? "valid" : "invalid";
}

function card(v: string): IdCheck {
  const d = digits(v);
  if (d.length < 13 || d.length > 19) return "unknown";
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i];
    if (i % 2 === 1) n = n * 2 > 9 ? n * 2 - 9 : n * 2;
    sum += n;
  }
  return sum % 10 === 0 ? "valid" : "invalid";
}

export function checkIdentifier(kind: IdKind, value: string): IdCheck {
  if (kind === "ogrn") return ogrn(value);
  if (kind === "inn") return inn(value);
  if (kind === "iban") return iban(value);
  if (kind === "card") return card(value);
  return "unknown";
}

/** Same number, ignoring spacing and punctuation. */
export const sameId = (a: string, b: string) =>
  a.replace(/[^0-9A-Za-z]/g, "").toUpperCase() === b.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
