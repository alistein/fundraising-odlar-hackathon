import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError } from "@/lib/auth";
import { finHash } from "@/lib/crypto";
import { lookupFin } from "@/lib/mygov";

const Body = z.object({
  fin: z.string().trim().min(1, "FIN yazın"),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

// Second gate: the organiser confirms identity through the MOCK MyGov sandbox.
// Only an HMAC of the FIN is stored, never the code itself.
export const POST = handler(
  async (req: Request, ctx: RouteContext<"/api/campaigns/[id]/identity">) => {
    const { id } = await ctx.params;
    const body = Body.parse(await req.json());

    const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, id));
    if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
    if (campaign.status === "rejected") throw new HttpError(409, "Kampaniya rədd edilib");
    if (campaign.identityVerifiedAt) throw new HttpError(409, "Şəxsiyyət artıq təsdiqlənib");
    // Gate 2 opens once gate 1 has run, whatever it found.
    if (!campaign.aiStatus) throw new HttpError(409, "Əvvəlcə AI yoxlamasını başladın");

    // Mock: any FIN and name are confirmed.
    lookupFin(body.fin, body.firstName, body.lastName);

    const [updated] = await db
      .update(schema.campaigns)
      .set({
        identityVerifiedAt: new Date(),
        identityFinHash: finHash(body.fin),
        // Both gates passed → live. A failed AI gate keeps it pending for review.
        ...(campaign.status === "pending" && campaign.aiStatus !== "fail"
          ? { status: "verified" as const, confirmedAt: new Date() }
          : {}),
      })
      .where(eq(schema.campaigns.id, id))
      .returning({ status: schema.campaigns.status });
    return Response.json({ verified: true, live: updated?.status === "verified" });
  },
);
