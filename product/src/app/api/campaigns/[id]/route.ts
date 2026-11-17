import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError } from "@/lib/auth";
import { getCampaign } from "@/lib/campaigns";

export const GET = handler(async (_req: Request, ctx: RouteContext<"/api/campaigns/[id]">) => {
  const { id } = await ctx.params;
  const row = await getCampaign(id);
  if (!row) throw new HttpError(404, "Kampaniya tapılmadı");
  const ledger = await db
    .select()
    .from(schema.ledgerEntries)
    .where(eq(schema.ledgerEntries.campaignId, id))
    .orderBy(asc(schema.ledgerEntries.seq));
  return Response.json({ ...row, ledger });
});
