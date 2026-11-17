import { count, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { type AppealVerdict, VERDICT_TITLE } from "@/lib/checker";
import { routeHash } from "@/lib/crypto";

// Verdicts that count as a caught (potential) scam.
export const FRAUD_VERDICTS: AppealVerdict[] = [
  "route_mismatch",
  "rejected",
  "altered",
  "serial_card",
  "multi_route",
  "pressure",
];

// Labels for the "recent" list where they differ from the checker's titles (team choice, 2026-11-17).
const RECENT_TITLE: Partial<Record<AppealVerdict, string>> = { rejected: "MyGov rədd edib" };

export type Stats = {
  raisedQepik: number;
  verifiedCampaigns: number;
  checks: number;
  frauds: number;
  blacklisted: number;
  protectedQepik: number;
  recent: { id: string; title: string; last4: string | null; amountQepik: number | null; at: string }[];
};

export async function getStats(): Promise<Stats> {
  const fraud = inArray(schema.appeals.verdict, FRAUD_VERDICTS);

  const [[raised], [verified], [checks], [frauds], fraudRoutes, clinics, campaigns, recent] =
    await Promise.all([
      db
        .select({ v: sql<number>`coalesce(sum(${schema.ledgerEntries.amountQepik}), 0)::int` })
        .from(schema.ledgerEntries)
        .where(eq(schema.ledgerEntries.type, "donation")),
      db.select({ v: count() }).from(schema.campaigns).where(eq(schema.campaigns.status, "verified")),
      db.select({ v: count() }).from(schema.appeals),
      db
        .select({
          v: count(),
          amount: sql<number>`coalesce(sum(${schema.appeals.amountQepik}), 0)::int`,
        })
        .from(schema.appeals)
        .where(fraud),
      db.select({ routes: schema.appeals.routes }).from(schema.appeals).where(fraud),
      db.select({ iban: schema.clinics.iban }).from(schema.clinics),
      db
        .select({ hash: schema.campaigns.declaredRouteHash })
        .from(schema.campaigns)
        .where(isNotNull(schema.campaigns.declaredRouteHash)),
      db
        .select()
        .from(schema.appeals)
        .where(fraud)
        .orderBy(desc(schema.appeals.createdAt))
        .limit(6),
    ]);

  // Cards and accounts seen in scam appeals, minus the official ones they were imitating.
  const official = new Set([
    ...clinics.map((c) => routeHash(c.iban)),
    ...campaigns.map((c) => c.hash).filter((h): h is string => !!h),
  ]);
  const blacklisted = new Set(
    fraudRoutes.flatMap((a) => a.routes.map((r) => r.hash)).filter((h) => !official.has(h)),
  );

  return {
    raisedQepik: raised.v,
    verifiedCampaigns: verified.v,
    checks: checks.v,
    frauds: frauds.v,
    blacklisted: blacklisted.size,
    protectedQepik: frauds.amount,
    recent: recent.map((a) => ({
      id: a.id,
      title:
        RECENT_TITLE[a.verdict as AppealVerdict] ?? VERDICT_TITLE[a.verdict as AppealVerdict] ?? a.verdict,
      last4: a.routes[0]?.last4 ?? null,
      amountQepik: a.amountQepik,
      at: a.createdAt.toISOString(),
    })),
  };
}
