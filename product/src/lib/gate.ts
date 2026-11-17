// Gate 1 for a new campaign: the AI check. Runs once, after the organiser has
// filled in the campaign and uploaded documents. Gate 2 (MyGov) opens only if
// this does not fail.
import { eq, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { aiEnabled, readAppeal, TACTIC_LABEL } from "@/lib/checker/ai";
import { containment, storyTokens } from "@/lib/checker/text";
import { FRAUD_VERDICTS } from "@/lib/stats";

export type GateResult = { status: "pass" | "warn" | "fail"; signals: string[] };

export async function runAiGate(campaignId: string): Promise<GateResult> {
  const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, campaignId));
  if (!campaign) throw new Error("campaign not found");

  const [docs, others, appeals] = await Promise.all([
    db.select().from(schema.documents).where(eq(schema.documents.campaignId, campaignId)),
    db.select().from(schema.campaigns).where(ne(schema.campaigns.id, campaignId)),
    db.select({ routes: schema.appeals.routes, verdict: schema.appeals.verdict }).from(schema.appeals),
  ]);

  const fail: string[] = [];
  const warn: string[] = [];

  // Documents: at least one, none flagged by the forgery check on upload.
  if (docs.length === 0) fail.push("Tibbi sənəd yüklənməyib");
  for (const d of docs)
    if (d.checkStatus === "flagged") fail.push(`${d.filename}: ${d.checkSignals[0] ?? "sənəd şübhəlidir"}`);

  // Clone: the same story already registered under another campaign.
  const mine = storyTokens(campaign.story);
  const copy = others.find((c) => containment(mine, storyTokens(c.story)) >= 0.6);
  if (copy) fail.push(`Bu hekayə başqa kampaniyada var: ${copy.title}`);

  // Card: used by another campaign, or seen in caught scam appeals.
  const card = campaign.declaredRouteHash;
  if (card) {
    if (others.some((c) => c.declaredRouteHash === card)) fail.push("Bu kart başqa kampaniyada bəyan edilib");
    const scam = new Set<string>(FRAUD_VERDICTS);
    if (appeals.some((a) => scam.has(a.verdict) && a.routes.some((r) => r.hash === card)))
      fail.push("Bu kart fırıldaq elanlarında görünüb");
  }

  // Story: a model reads it for pressure tactics and claims that cannot be true.
  if (aiEnabled()) {
    const reading = await readAppeal(campaign.story, []);
    for (const m of reading?.manipulation ?? []) warn.push(`${TACTIC_LABEL[m.tactic]}: «${m.quote}»`);
    for (const i of reading?.implausible ?? []) warn.push(i);
  }

  const status = fail.length ? "fail" : warn.length ? "warn" : "pass";
  const signals = fail.length ? fail : warn.length ? warn : ["Fırıldaq əlaməti tapılmadı"];
  await db
    .update(schema.campaigns)
    .set({ aiStatus: status, aiSignals: signals, aiCheckedAt: new Date() })
    .where(eq(schema.campaigns.id, campaignId));
  return { status, signals };
}
