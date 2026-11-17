import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, organiserOrDemo } from "@/lib/auth";
import { runAiGate, toSteps } from "@/lib/gate";

// Gate 1 for a new campaign. Runs once; its result decides whether MyGov opens.
export const POST = handler(async (_req: Request, ctx: RouteContext<"/api/campaigns/[id]/ai-gate">) => {
  const user = await organiserOrDemo();
  const { id } = await ctx.params;
  const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, id));
  if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
  if (campaign.organiserId !== user.id) throw new HttpError(403, "Bu kampaniya sizə aid deyil");
  // Already run: return the stored steps. Rows from before steps existed run again.
  const stored = toSteps(campaign.aiSignals);
  if (campaign.aiCheckedAt && stored.length)
    return Response.json({ status: campaign.aiStatus, steps: stored });
  return Response.json(await runAiGate(id));
});
