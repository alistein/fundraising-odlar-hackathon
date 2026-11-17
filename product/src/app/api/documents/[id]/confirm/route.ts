import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, requireRole } from "@/lib/auth";

// The campaign's clinic vouches for one exact file. From then on the file's
// hash and its SD- code are the public proof that the clinic issued it.
export const POST = handler(
  async (_req: Request, ctx: RouteContext<"/api/documents/[id]/confirm">) => {
    const user = await requireRole("clinic");
    const { id } = await ctx.params;

    const [row] = await db
      .select({ doc: schema.documents, clinicId: schema.campaigns.clinicId })
      .from(schema.documents)
      .innerJoin(schema.campaigns, eq(schema.campaigns.id, schema.documents.campaignId))
      .where(eq(schema.documents.id, id));
    if (!row) throw new HttpError(404, "Sənəd tapılmadı");
    if (row.clinicId !== user.clinicId)
      throw new HttpError(403, "Bu sənəd sizin klinikaya aid deyil");
    if (row.doc.confirmedAt) throw new HttpError(409, "Sənəd artıq təsdiqlənib");

    const [document] = await db
      .update(schema.documents)
      .set({ confirmedAt: new Date(), code: `SD-${randomInt(100000, 1000000)}` })
      .where(eq(schema.documents.id, id))
      .returning({ id: schema.documents.id, code: schema.documents.code });
    return Response.json({ document });
  },
);
