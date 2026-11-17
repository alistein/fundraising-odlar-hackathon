import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, requireRole } from "@/lib/auth";
import { aznToQepik } from "@/lib/money";

const Body = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("confirm"), confirmedCostAzn: z.number().positive() }),
  z.object({ decision: z.literal("reject") }),
]);

// Only the clinic named on the campaign can confirm diagnosis and cost.
export const POST = handler(
  async (req: Request, ctx: RouteContext<"/api/campaigns/[id]/confirm">) => {
    const user = await requireRole("clinic");
    const { id } = await ctx.params;
    const body = Body.parse(await req.json());

    const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, id));
    if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
    if (campaign.clinicId !== user.clinicId)
      throw new HttpError(403, "Bu kampaniya sizin klinikaya aid deyil");
    if (campaign.status !== "pending") throw new HttpError(409, "Kampaniya artıq yoxlanılıb");

    const [updated] = await db
      .update(schema.campaigns)
      .set(
        body.decision === "confirm"
          ? {
              status: "verified",
              confirmedCostQepik: aznToQepik(body.confirmedCostAzn),
              confirmedAt: new Date(),
            }
          : { status: "rejected" },
      )
      .where(eq(schema.campaigns.id, id))
      .returning();
    return Response.json({ campaign: updated });
  },
);
