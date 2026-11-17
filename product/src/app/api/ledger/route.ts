import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";

// Public: anyone can read every donation and payout.
export const GET = handler(async () => {
  const entries = await db
    .select()
    .from(schema.ledgerEntries)
    .orderBy(desc(schema.ledgerEntries.seq));
  return Response.json({ entries });
});
