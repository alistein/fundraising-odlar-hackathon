import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { toSteps } from "@/lib/gate";
import { CampaignWizard } from "./wizard";

// Campaign creator: details → documents → AI gate → MyGov gate → live.
export default async function NewCampaignPage({ searchParams }: PageProps<"/campaigns/new">) {
  const { kampaniya } = await searchParams;
  const clinics = await db
    .select({ id: schema.clinics.id, name: schema.clinics.name })
    .from(schema.clinics);

  // Resume a campaign that is still being created.
  let resume = null;
  if (typeof kampaniya === "string") {
    const [c] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, kampaniya));
    if (c && c.status === "pending") {
      const docs = await db
        .select({
          id: schema.documents.id,
          filename: schema.documents.filename,
          checkStatus: schema.documents.checkStatus,
          checkSignals: schema.documents.checkSignals,
        })
        .from(schema.documents)
        .where(eq(schema.documents.campaignId, c.id));
      resume = {
        id: c.id,
        title: c.title,
        docs,
        ai: c.aiStatus && toSteps(c.aiSignals).length ? { status: c.aiStatus, steps: toSteps(c.aiSignals) } : null,
      };
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h1 className="display text-4xl sm:text-5xl">Kampaniya yarat</h1>
      <CampaignWizard clinics={clinics} resume={resume} />
    </div>
  );
}
