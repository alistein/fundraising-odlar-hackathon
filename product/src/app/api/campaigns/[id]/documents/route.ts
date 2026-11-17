import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, requireRole } from "@/lib/auth";
import { compareWithCampaign, fileSignals, readFile } from "@/lib/checker/ai";
import { inspectDocument } from "@/lib/checker/document";
import { analyseImage } from "@/lib/checker/forensics";
import { normalise } from "@/lib/checker/text";
import { encryptFile, sha256 } from "@/lib/crypto";
import { putCiphertext } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024;

// Organiser uploads a certificate or invoice. The file is checked for reuse and
// tamper signals, encrypted, and only the ciphertext is stored.
export const POST = handler(
  async (req: Request, ctx: RouteContext<"/api/campaigns/[id]/documents">) => {
    const user = await requireRole("organiser");
    const { id } = await ctx.params;

    const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, id));
    if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
    if (campaign.organiserId !== user.id)
      throw new HttpError(403, "Bu kampaniya sizə aid deyil");

    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) throw new HttpError(400, "Fayl seçilməyib");
    if (file.size > MAX_BYTES) throw new HttpError(413, "Fayl 5 MB-dan böyükdür");

    const plain = Buffer.from(await file.arrayBuffer());
    const report = inspectDocument(plain);
    if (!report.type) throw new HttpError(415, "Yalnız PDF, JPG və ya PNG");

    const hash = sha256(plain);
    const same = await db.select().from(schema.documents).where(eq(schema.documents.sha256, hash));
    if (same.some((d) => d.campaignId === id)) throw new HttpError(409, "Bu sənəd artıq yüklənib");

    // A model reads the page for visible edits and for what it says; the
    // comparison with the campaign is a plain rule. Null when AI is off.
    const [reading, pixels] = await Promise.all([
      readFile(plain, report.type),
      analyseImage(plain, report.type),
    ]);
    const signals = [
      ...(same.length ? ["Bu sənəd başqa kampaniyada istifadə olunub"] : []),
      ...report.signals,
      ...(pixels?.signals ?? []),
      ...fileSignals(reading),
      ...(reading?.kind === "medical_document"
        ? compareWithCampaign(reading, campaign, normalise)
        : []),
    ];

    const { ciphertext, iv, authTag } = encryptFile(plain);
    const blobUrl = await putCiphertext(`${id}-${hash.slice(0, 16)}.bin`, ciphertext);

    const [document] = await db
      .insert(schema.documents)
      .values({
        campaignId: id,
        kind: "document",
        filename: file.name.slice(0, 200),
        sha256: hash,
        blobUrl,
        iv,
        authTag,
        checkStatus: signals.length ? "flagged" : "clean",
        checkSignals: signals,
      })
      .returning({
        id: schema.documents.id,
        filename: schema.documents.filename,
        checkStatus: schema.documents.checkStatus,
        checkSignals: schema.documents.checkSignals,
      });
    return Response.json({ document }, { status: 201 });
  },
);
