// TODO (Sprint II): document upload + forgery check.
// Plan: read file -> sha256() for reuse lookup in `documents` -> metadata / AI
// tamper signals -> encryptFile() -> put ciphertext in Vercel Blob -> insert row.
export async function POST() {
  return Response.json({ error: "Not implemented yet" }, { status: 501 });
}
