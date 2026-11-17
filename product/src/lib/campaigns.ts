import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";

const raised = sql<number>`coalesce((
  select sum(${schema.ledgerEntries.amountQepik})
  from ${schema.ledgerEntries}
  where ${schema.ledgerEntries.campaignId} = ${schema.campaigns.id}
    and ${schema.ledgerEntries.type} = 'donation'
), 0)::int`;

const columns = {
  campaign: schema.campaigns,
  clinicName: schema.clinics.name,
  raisedQepik: raised,
};

export function listCampaigns() {
  return db
    .select(columns)
    .from(schema.campaigns)
    .innerJoin(schema.clinics, eq(schema.clinics.id, schema.campaigns.clinicId))
    .orderBy(desc(schema.campaigns.createdAt));
}

export async function getCampaign(id: string) {
  const [row] = await db
    .select(columns)
    .from(schema.campaigns)
    .innerJoin(schema.clinics, eq(schema.clinics.id, schema.campaigns.clinicId))
    .where(eq(schema.campaigns.id, id));
  return row ?? null;
}
