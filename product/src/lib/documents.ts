// Clinic-confirmed documents: the one thing the checker can vouch for.
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { CampaignRef } from "@/lib/checker";

const fields = {
  code: schema.documents.code,
  sha256: schema.documents.sha256,
  confirmedAt: schema.documents.confirmedAt,
  checkStatus: schema.documents.checkStatus,
  campaignId: schema.campaigns.id,
  campaignTitle: schema.campaigns.title,
  campaignCode: schema.campaigns.code,
  campaignStatus: schema.campaigns.status,
  organiserId: schema.campaigns.organiserId,
  clinicName: schema.clinics.name,
};

const query = () =>
  db
    .select(fields)
    .from(schema.documents)
    .innerJoin(schema.campaigns, eq(schema.campaigns.id, schema.documents.campaignId))
    .innerJoin(schema.clinics, eq(schema.clinics.id, schema.campaigns.clinicId));

export type RegisteredDocument = Awaited<ReturnType<typeof query>>[number];

export async function findDocumentByCode(code: string): Promise<RegisteredDocument | null> {
  const [row] = await query().where(eq(schema.documents.code, code));
  return row?.confirmedAt ? row : null;
}

export function findDocumentsByHash(sha256: string): Promise<RegisteredDocument[]> {
  return query().where(eq(schema.documents.sha256, sha256));
}

/** First 16 hex digits of the file's SHA-256, grouped for reading aloud. */
export function fingerprint(sha256: string): string {
  return sha256.slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");
}

export const campaignOf = (d: RegisteredDocument): CampaignRef => ({
  id: d.campaignId,
  title: d.campaignTitle,
  code: d.campaignCode,
  clinicName: d.clinicName,
  organiserId: d.organiserId,
});
