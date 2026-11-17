import { createHash } from "node:crypto";
import { asc, desc, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { LedgerEntry } from "@/db/schema";

export const GENESIS_HASH = "0".repeat(64);

type EntryBody = Pick<
  LedgerEntry,
  "seq" | "campaignId" | "type" | "amountQepik" | "label" | "createdAt"
>;

// Fixed field order so the hash is reproducible by anyone.
export function hashEntry(prevHash: string, e: EntryBody): string {
  const payload = JSON.stringify([
    e.seq,
    e.campaignId,
    e.type,
    e.amountQepik,
    e.label,
    e.createdAt,
  ]);
  return createHash("sha256").update(prevHash).update(payload).digest("hex");
}

export async function appendLedgerEntry(input: {
  campaignId: string;
  type: LedgerEntry["type"];
  amountQepik: number;
  label: string;
}): Promise<LedgerEntry> {
  return db.transaction(async (tx) => {
    // Serialise appends so two donations cannot claim the same seq.
    await tx.execute(sql`select pg_advisory_xact_lock(7001)`);
    const [last] = await tx
      .select()
      .from(schema.ledgerEntries)
      .orderBy(desc(schema.ledgerEntries.seq))
      .limit(1);

    const body: EntryBody = {
      seq: (last?.seq ?? 0) + 1,
      campaignId: input.campaignId,
      type: input.type,
      amountQepik: input.amountQepik,
      label: input.label,
      createdAt: new Date().toISOString(),
    };
    const prevHash = last?.hash ?? GENESIS_HASH;
    const [row] = await tx
      .insert(schema.ledgerEntries)
      .values({ ...body, prevHash, hash: hashEntry(prevHash, body) })
      .returning();
    return row;
  });
}

export type ChainCheck =
  | { ok: true; entries: number; head: string }
  | { ok: false; entries: number; brokenAtSeq: number; reason: string };

// Recompute every hash from genesis. Any edited, removed or reordered row breaks it.
export async function verifyChain(): Promise<ChainCheck> {
  const rows = await db
    .select()
    .from(schema.ledgerEntries)
    .orderBy(asc(schema.ledgerEntries.seq));

  let prev = GENESIS_HASH;
  let expectedSeq = 1;
  for (const r of rows) {
    if (r.seq !== expectedSeq)
      return { ok: false, entries: rows.length, brokenAtSeq: expectedSeq, reason: "missing entry" };
    if (r.prevHash !== prev)
      return { ok: false, entries: rows.length, brokenAtSeq: r.seq, reason: "previous-hash mismatch" };
    if (hashEntry(prev, r) !== r.hash)
      return { ok: false, entries: rows.length, brokenAtSeq: r.seq, reason: "entry was altered" };
    prev = r.hash;
    expectedSeq++;
  }
  return { ok: true, entries: rows.length, head: prev };
}
