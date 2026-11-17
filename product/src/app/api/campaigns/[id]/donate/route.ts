import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { getSession, HttpError } from "@/lib/auth";
import { appendLedgerEntry } from "@/lib/ledger";
import { aznToQepik } from "@/lib/money";

const Body = z.object({
  amountAzn: z.number().positive().max(100_000),
  anonymous: z.boolean().default(false),
});

// TEST PAYMENT: no card is charged and no bank is contacted. The donation is
// written straight to the ledger against the clinic's account.
export const POST = handler(
  async (req: Request, ctx: RouteContext<"/api/campaigns/[id]/donate">) => {
    const { id } = await ctx.params;
    const body = Body.parse(await req.json());
    const user = await getSession();

    const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, id));
    if (!campaign) throw new HttpError(404, "Kampaniya tapılmadı");
    if (campaign.status !== "verified")
      throw new HttpError(409, "Klinika təsdiqləməyənə qədər ianə qəbul edilmir");

    const entry = await appendLedgerEntry({
      campaignId: id,
      type: "donation",
      amountQepik: aznToQepik(body.amountAzn),
      label: body.anonymous || !user ? "Anonim" : user.name,
    });
    return Response.json({ entry }, { status: 201 });
  },
);
