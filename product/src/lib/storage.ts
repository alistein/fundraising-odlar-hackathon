// Ciphertext storage. Vercel Blob (private store) when a token is set,
// otherwise a local folder so development works without cloud keys.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";

const LOCAL_DIR = path.join(process.cwd(), ".data", "docs");

export async function putCiphertext(name: string, data: Buffer): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`docs/${name}`, data, {
      access: "private",
      contentType: "application/octet-stream",
      addRandomSuffix: true,
    });
    return blob.url;
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DIR, name), data);
  return `local:${name}`;
}

export async function getCiphertext(url: string): Promise<Buffer> {
  if (url.startsWith("local:"))
    return readFile(path.join(LOCAL_DIR, path.basename(url.slice("local:".length))));
  const res = await get(url, { access: "private" });
  if (!res || res.statusCode !== 200) throw new Error("Blob not found");
  return Buffer.from(await new Response(res.stream).arrayBuffer());
}
