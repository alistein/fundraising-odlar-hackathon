import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export function clinicReportsFor(campaignId: string) {
  return db
    .select()
    .from(schema.clinicReports)
    .where(eq(schema.clinicReports.campaignId, campaignId))
    .orderBy(desc(schema.clinicReports.createdAt));
}
