import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError } from "@/lib/auth";

const Body = z.object({
  clinicName: z.string().trim().min(2, "Klinikanın adını yazın"),
  email: z.string().trim().email("E-poçt düzgün deyil"),
  reason: z.string().trim().min(5, "Səbəbi yazın"),
});

// Optional last stage: a clinic reports a campaign that misuses its name.
// The report is stored unconfirmed; we confirm it by writing back to the clinic's
// own email (outside the app in the MVP). Only a confirmed report blocks the campaign.
export const POST = handler(async (req: Request, ctx: RouteContext<"/api/campaigns/[id]/report">) => {
  const { id } = await ctx.params;
  const body = Body.parse(await req.json());
  const [campaign] = await db
    .select({ id: schema.campaigns.id })
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, id));
  if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
  await db.insert(schema.clinicReports).values({ campaignId: id, ...body });
  return Response.json({ reported: true }, { status: 201 });
});
