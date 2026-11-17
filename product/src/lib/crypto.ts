import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";

// AES-256-GCM for medical files. Key: 32 bytes, base64, in FILE_ENCRYPTION_KEY.
function key(): Buffer {
  const b64 = process.env.FILE_ENCRYPTION_KEY;
  if (!b64) throw new Error("FILE_ENCRYPTION_KEY is not set");
  const k = Buffer.from(b64, "base64");
  if (k.length !== 32) throw new Error("FILE_ENCRYPTION_KEY must be 32 bytes (base64)");
  return k;
}

export function encryptFile(plain: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
  return {
    ciphertext,
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptFile(ciphertext: Buffer, iv: string, authTag: string): Buffer {
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function sha256(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

// Keyed hash for card numbers and IBANs. A plain SHA-256 of 16 digits can be
// brute-forced, so the server key is mixed in. Input is digits/letters only.
export function routeHash(value: string): string {
  const clean = value.replace(/[^0-9a-z]/gi, "").toUpperCase();
  return createHmac("sha256", key()).update(`route:${clean}`).digest("hex");
}

// Keyed hash of a personal ID code (FIN). The code itself is never stored.
export function finHash(fin: string): string {
  return createHmac("sha256", key()).update(`fin:${fin.trim().toUpperCase()}`).digest("hex");
}
