// Gate 1 for a new campaign: the AI check. Runs once, after the organiser has
// filled in the campaign and uploaded documents. Each check is reported as a
// step, like the link checker, so the organiser sees exactly what was found.
// A failed gate does not block MyGov; it keeps the campaign from going live.
import { eq, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { aiEnabled, readAppeal, TACTIC_LABEL } from "@/lib/checker/ai";
import { containment, storyTokens } from "@/lib/checker/text";

export type GateStepId = "docs" | "forgery" | "clone" | "story";
export type GateStep = {
  id: GateStepId;
  status: "pass" | "warn" | "fail" | "skip";
  findings: string[];
};
export type GateResult = { status: "pass" | "warn" | "fail"; steps: GateStep[] };

export async function runAiGate(campaignId: string): Promise<GateResult> {
  const [campaign] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, campaignId));
  if (!campaign) throw new Error("campaign not found");

  const [docs, others] = await Promise.all([
    db.select().from(schema.documents).where(eq(schema.documents.campaignId, campaignId)),
    db.select().from(schema.campaigns).where(ne(schema.campaigns.id, campaignId)),
  ]);

  const steps: GateStep[] = [];

  // 1. At least one medical document.
  steps.push(
    docs.length
      ? { id: "docs", status: "pass", findings: [`${docs.length} sənəd yüklənib`] }
      : { id: "docs", status: "fail", findings: ["Tibbi sənəd yüklənməyib"] },
  );

  // 2. Forgery: every signal the upload check found, per file.
  const flagged = docs.filter((d) => d.checkStatus === "flagged");
  steps.push(
    !docs.length
      ? { id: "forgery", status: "skip", findings: [] }
      : flagged.length
        ? {
            id: "forgery",
            status: "fail",
            findings: flagged.flatMap((d) =>
              (d.checkSignals.length ? d.checkSignals : ["Sənəd şübhəlidir"]).map((s) => `${d.filename}: ${s}`),
            ),
          }
        : { id: "forgery", status: "pass", findings: ["Saxtakarlıq izi tapılmadı"] },
  );

  // 3. Clone: the same story already registered under another campaign.
  const mine = storyTokens(campaign.story);
  const copy = others.find((c) => containment(mine, storyTokens(c.story)) >= 0.6);
  steps.push(
    copy
      ? { id: "clone", status: "fail", findings: [`Bu hekayə başqa kampaniyada var: ${copy.title}`] }
      : { id: "clone", status: "pass", findings: ["Hekayə başqa kampaniyada yoxdur"] },
  );

  // 4. A model reads the story for pressure tactics and claims that cannot be true.
  if (aiEnabled()) {
    const reading = await readAppeal(campaign.story, []);
    const found = [
      ...(reading?.manipulation ?? []).map((m) => `${TACTIC_LABEL[m.tactic]}: «${m.quote}»`),
      ...(reading?.implausible ?? []),
    ];
    steps.push(
      found.length
        ? { id: "story", status: "warn", findings: found }
        : { id: "story", status: "pass", findings: ["Təzyiq və ziddiyyət tapılmadı"] },
    );
  } else steps.push({ id: "story", status: "skip", findings: [] });

  const status = steps.some((s) => s.status === "fail")
    ? "fail"
    : steps.some((s) => s.status === "warn")
      ? "warn"
      : "pass";
  await db
    .update(schema.campaigns)
    .set({ aiStatus: status, aiSignals: steps, aiCheckedAt: new Date() })
    .where(eq(schema.campaigns.id, campaignId));
  return { status, steps };
}

/** Stored steps, ignoring anything that is not a step (older rows held plain strings). */
export function toSteps(raw: unknown[]): GateStep[] {
  return raw.filter(
    (x): x is GateStep => typeof x === "object" && x !== null && "id" in x && "status" in x,
  );
}
