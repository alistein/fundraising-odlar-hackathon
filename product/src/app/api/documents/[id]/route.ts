import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, requireRole } from "@/lib/auth";
import { detectType } from "@/lib/checker/document";
import { decryptFile } from "@/lib/crypto";
import { getCiphertext } from "@/lib/storage";

const MIME = { pdf: "application/pdf", jpeg: "image/jpeg", png: "image/png" } as const;

// Only the clinic named on the campaign can read a medical file. It is
// decrypted here, per request, and never written anywhere in the clear.
export const GET = handler(async (_req: Request, ctx: RouteContext<"/api/documents/[id]">) => {
  const user = await requireRole("clinic");
  const { id } = await ctx.params;

  const [row] = await db
    .select({ doc: schema.documents, clinicId: schema.campaigns.clinicId })
    .from(schema.documents)
    .innerJoin(schema.campaigns, eq(schema.campaigns.id, schema.documents.campaignId))
    .where(eq(schema.documents.id, id));
  if (!row) throw new HttpError(404, "Sənəd tapılmadı");
  if (row.clinicId !== user.clinicId) throw new HttpError(403, "Bu sənəd sizin klinikaya aid deyil");

  const plain = decryptFile(await getCiphertext(row.doc.blobUrl), row.doc.iv, row.doc.authTag);
  const type = detectType(plain);
  return new Response(new Uint8Array(plain), {
    headers: {
      "content-type": type ? MIME[type] : "application/octet-stream",
      "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(row.doc.filename)}`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
});
