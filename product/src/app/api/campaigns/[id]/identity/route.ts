import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError } from "@/lib/auth";
import { finHash } from "@/lib/crypto";
import { FIN_PATTERN, lookupFin } from "@/lib/mygov";

const Body = z.object({
  fin: z.string().trim().toUpperCase().regex(FIN_PATTERN, "FIN 7 simvol olmalıdır"),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

const REFUSED = {
  not_found: "FIN tapılmadı",
  name_mismatch: "Ad FIN ilə uyğun gəlmir",
  inactive: "Şəxsiyyət vəsiqəsi etibarsızdır",
} as const;

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
    // Gate 2 opens only after gate 1.
    if (campaign.aiStatus !== "pass" && campaign.aiStatus !== "warn")
      throw new HttpError(409, "Əvvəlcə AI yoxlamasından keçin");

    const result = lookupFin(body.fin, body.firstName, body.lastName);
    if (result.outcome !== "found") throw new HttpError(422, REFUSED[result.outcome]);

    await db
      .update(schema.campaigns)
      .set({
        identityVerifiedAt: new Date(),
        identityFinHash: finHash(body.fin),
        // Passing the MyGov gate is what makes a campaign live (clinics no longer confirm).
        ...(campaign.status === "pending" ? { status: "verified" as const, confirmedAt: new Date() } : {}),
      })
      .where(eq(schema.campaigns.id, id));
    return Response.json({ verified: true });
  },
);
