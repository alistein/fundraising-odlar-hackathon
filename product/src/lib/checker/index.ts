// Appeal analysis: find the campaign an appeal is about, compare its claims
// with the registry, fall back to memory of past checks. Rules decide, not a
// model. The result is split by where each finding came from, so the pipeline
// (pipeline.ts) can show and score every source separately.
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import type { AppealRoute } from "@/db/schema";
import { listCampaigns } from "@/lib/campaigns";
import { routeHash } from "@/lib/crypto";
import { formatAZN } from "@/lib/money";
import { aiEnabled, readAppeal, reviewAppeal, TACTIC_LABEL } from "./ai";
import {
  containment,
  countStories,
  entityMatch,
  extractIdentifiers,
  sameStory,
  storyTokens,
} from "./text";

export type AppealVerdict =
  | "verified" // clinic-confirmed campaign, official route
  | "declared" // registered by the organiser, clinic has not confirmed yet
  | "route_mismatch" // known case, payment details are not the official ones
  | "stale" // collection is finished
  | "altered" // amount differs from what the clinic confirmed
  | "rejected" // clinic rejected the case
  | "serial_card" // one card used in several unrelated stories
  | "multi_route" // one story circulating with several cards
  | "pressure" // not in the registry and written with scam pressure tactics (AI-read)
  | "not_appeal" // the text does not ask for a donation
  | "unknown";

export type CampaignRef = {
  id: string;
  title: string;
  code: string | null;
  clinicName: string;
  organiserId: string;
};

export type AppealAnalysis = {
  verdict: AppealVerdict;
  title: string;
  /** What the registry rules found. */
  registry: string[];
  /** What the memory of earlier checks found. */
  memory: string[];
  /** Pressure tactics the model read, each with the words that show it. */
  manipulation: string[];
  /** Things a reader cannot check: no clinic named, no documents, personal card. */
  missing: string[];
  /** Claims that contradict each other or cannot be true. */
  implausible: string[];
  /** A second, independent read disagreed that the appeal is manipulative. */
  disputed: boolean;
  /** Null when no model read the text. */
  isAppeal: boolean | null;
  campaign: CampaignRef | null;
  /** Who and what the appeal is about, for looking it up elsewhere. */
  claims: { patientName: string; diagnosis: string | null; clinic: string | null } | null;
  aiUsed: boolean;
};

const TITLE: Record<AppealVerdict, string> = {
  verified: "Təsdiqlənmiş kampaniya",
  declared: "Klinika təsdiqi gözlənilir",
  route_mismatch: "Ödəniş yolu təsdiqlənməyib",
  stale: "Yığım başa çatıb",
  altered: "Məlumat dəyişdirilib",
  rejected: "Klinika rədd edib",
  serial_card: "Şübhəli kart",
  multi_route: "Şübhəli elan",
  pressure: "Şübhəli elan",
  not_appeal: "Elan tapılmadı",
  unknown: "Təsdiqlənməyib",
};

const mask = (r: AppealRoute) => `•••• ${r.last4}`;

type Row = Awaited<ReturnType<typeof listCampaigns>>[number];

export const campaignRef = (r: Row): CampaignRef => ({
  id: r.campaign.id,
  title: r.campaign.title,
  code: r.campaign.code,
  clinicName: r.clinicName,
  organiserId: r.campaign.organiserId,
});

function campaignFingerprint(r: Row): string[] {
  const c = r.campaign;
  return storyTokens(`${c.title} ${c.story} ${c.diagnosis}`);
}

/** Which campaign is this appeal about, by the rules alone. */
function findCampaign(
  text: string,
  tokens: string[],
  ids: ReturnType<typeof extractIdentifiers>,
  routes: AppealRoute[],
  rows: Row[],
): { row: Row; by: "code" | "route" | "story" | "ai" } | null {
  const byCode = rows.find(
    (r) =>
      (r.campaign.code && ids.codes.includes(r.campaign.code)) ||
      ids.campaignIds.includes(r.campaign.id),
  );
  if (byCode) return { row: byCode, by: "code" };

  const hashes = new Set(routes.map((r) => r.hash));
  const byRoute = rows.find(
    (r) => r.campaign.declaredRouteHash && hashes.has(r.campaign.declaredRouteHash),
  );
  if (byRoute) return { row: byRoute, by: "route" };

  let best: { row: Row; score: number } | null = null;
  for (const row of rows) {
    const fp = campaignFingerprint(row);
    const shared = containment(fp, tokens);
    const score =
      shared >= 0.5 && shared * fp.length >= 4
        ? shared
        : entityMatch(text, row.campaign.patientName, row.campaign.diagnosis)
          ? 0.5
          : 0;
    if (score > 0 && (!best || score > best.score)) best = { row, score };
  }
  return best ? { row: best.row, by: "story" } : null;
}

export async function analyseAppeal(text: string): Promise<AppealAnalysis> {
  const ids = extractIdentifiers(text);
  const tokens = storyTokens(text);
  const routes: AppealRoute[] = [
    ...ids.cards.map((v) => ({ kind: "card" as const, hash: routeHash(v), last4: v.slice(-4) })),
    ...ids.ibans.map((v) => ({ kind: "iban" as const, hash: routeHash(v), last4: v.slice(-4) })),
  ];

  const [rows, clinics, past] = await Promise.all([
    listCampaigns(),
    db.select().from(schema.clinics),
    db.select().from(schema.appeals).orderBy(desc(schema.appeals.createdAt)).limit(500),
  ]);
  const clinicIban = new Map(clinics.map((c) => [c.id, routeHash(c.iban)]));

  let found = findCampaign(text, tokens, ids, routes, rows);

  // A model reads every real appeal: it recognises a rewritten or translated
  // copy of a registered case, names the pressure tactics, and extracts who the
  // appeal is about. Its answer is data for the rules below, nothing more.
  const reading =
    text.length >= 40 && aiEnabled()
      ? await readAppeal(
          text,
          rows.map((r) => ({
            id: r.campaign.id,
            patientName: r.campaign.patientName,
            diagnosis: r.campaign.diagnosis,
            clinicName: r.clinicName,
            title: r.campaign.title,
          })),
        )
      : null;
  const aiRow = !found && reading && rows.find((r) => r.campaign.id === reading.matchedCampaignId);
  if (aiRow) found = { row: aiRow, by: "ai" };

  let verdict: AppealVerdict;
  let title: string | null = null;
  const registry: string[] = [];
  const memory: string[] = [];
  const isAppeal = !!reading?.isDonationAppeal;
  let manipulation = isAppeal
    ? reading!.manipulation.map((m) => `${TACTIC_LABEL[m.tactic]}: «${m.quote.trim()}»`)
    : [];
  const missing = isAppeal
    ? [
        ...(reading!.asksPersonalCard ? ["Şəxsi karta köçürmə istənilir"] : []),
        ...(reading!.namesClinic ? [] : ["Klinika göstərilməyib"]),
        ...(reading!.offersDocuments ? [] : ["Sənəd və ya rəsmi səhifə göstərilməyib"]),
      ]
    : [];
  const implausible = isAppeal ? reading!.implausible.slice(0, 3) : [];
  let disputed = false;

  if (found) {
    const { row, by } = found;
    const c = row.campaign;
    const official = new Set(
      [clinicIban.get(c.clinicId), c.declaredRouteHash].filter((h): h is string => !!h),
    );
    const foreign = routes.filter((r) => !official.has(r.hash));
    const claimed = Math.max(0, ...ids.amountsAzn, reading?.amountAzn ?? 0) * 100;
    const confirmed = c.confirmedCostQepik ?? c.targetQepik;

    if (c.status === "rejected") {
      verdict = "rejected";
      registry.push("Klinika bu xəstə və diaqnozu təsdiqləməyib");
    } else if (foreign.length > 0) {
      verdict = "route_mismatch";
      registry.push("Bu hekayə reyestrdəki kampaniyaya uyğundur");
      for (const r of foreign)
        registry.push(`${mask(r)} ${r.kind === "card" ? "kartı" : "hesabı"} bu kampaniyaya aid deyil`);
      registry.push("Bu yolla göndərilən pul klinikaya çatmır");
    } else if (c.closedAt || row.raisedQepik >= c.targetQepik) {
      verdict = "stale";
      registry.push("Kampaniya bağlanıb, elan isə hələ də paylaşılır");
    } else if (claimed > confirmed * 1.1) {
      verdict = "altered";
      registry.push(
        `Elanda ${formatAZN(claimed)} yazılıb, ${c.status === "verified" ? "klinika" : "kampaniya"} ${formatAZN(confirmed)} göstərir`,
      );
    } else if (c.status === "verified") {
      verdict = "verified";
      registry.push("Klinika diaqnozu və xərci təsdiqləyib");
      registry.push("İanələr birbaşa klinikanın hesabına gedir");
    } else {
      verdict = "declared";
      registry.push(
        by === "route"
          ? "Bu kart təşkilatçının bəyan etdiyi kartdır"
          : "Təşkilatçı qeydiyyatdan keçib",
      );
      registry.push("Klinika diaqnozu hələ təsdiqləməyib");
    }
  } else {
    // No registry match: memory of earlier checks, then what the model read.
    const serial = routes
      .map((r) => {
        const seen = past.filter((a) => a.routes.some((x) => x.hash === r.hash));
        return { r, stories: countStories([tokens, ...seen.map((a) => a.tokens)]) };
      })
      .filter((x) => x.stories >= 2)
      .sort((a, b) => b.stories - a.stories)[0];

    const sameStoryRoutes = new Set(routes.map((r) => r.hash));
    for (const a of past)
      if (sameStory(tokens, a.tokens)) for (const x of a.routes) sameStoryRoutes.add(x.hash);

    const seenBefore = past.filter((a) => sameStory(tokens, a.tokens)).length;
    if (seenBefore > 0) memory.push(`Bu hekayə əvvəl ${seenBefore} dəfə yoxlanılıb`);

    const clinicOnly = clinics.find((c) => routes.some((r) => r.hash === clinicIban.get(c.id)));

    if (serial) {
      verdict = "serial_card";
      memory.push(`${mask(serial.r)} kartı ${serial.stories} fərqli hekayədə istifadə olunub`);
      registry.push("Bu elan reyestrdə yoxdur");
    } else if (sameStoryRoutes.size >= 2) {
      verdict = "multi_route";
      memory.push(`Bu hekayə ${sameStoryRoutes.size} fərqli kart nömrəsi ilə paylaşılıb`);
      registry.push("Bu elan reyestrdə yoxdur");
    } else if (clinicOnly && routes.length === 1) {
      verdict = "verified";
      title = "Klinika hesabı";
      registry.push(`Hesab sahibi: ${clinicOnly.name}`);
    } else if (manipulation.length >= 2) {
      // Before calling an unknown family's appeal manipulative, ask a second reader.
      const second = await reviewAppeal(text);
      if (second && !second.manipulative) {
        disputed = true;
        manipulation = manipulation.slice(0, 1);
        verdict = "unknown";
        registry.push("Bu elan reyestrdə yoxdur");
        registry.push("Təşkilatçıdan Safefund kodunu istəyin");
      } else {
        verdict = "pressure";
        registry.push("Bu elan reyestrdə yoxdur");
      }
    } else if (reading && !reading.isDonationAppeal && routes.length === 0) {
      verdict = "not_appeal";
      registry.push("Bu mətn ianə elanına oxşamır");
    } else {
      verdict = "unknown";
      registry.push("Bu elan reyestrdə yoxdur");
      registry.push("Təşkilatçıdan Safefund kodunu istəyin");
    }
  }

  await db.insert(schema.appeals).values({
    tokens,
    routes,
    matchedCampaignId: found?.row.campaign.id ?? null,
    verdict,
  });

  const c = found?.row.campaign;
  return {
    verdict,
    title: title ?? TITLE[verdict],
    registry,
    memory,
    manipulation,
    missing,
    implausible,
    disputed,
    isAppeal: reading ? reading.isDonationAppeal : null,
    campaign: found ? campaignRef(found.row) : null,
    claims: c
      ? { patientName: c.patientName, diagnosis: c.diagnosis, clinic: found!.row.clinicName }
      : reading?.isDonationAppeal && reading.patientName
        ? { patientName: reading.patientName, diagnosis: reading.diagnosis, clinic: reading.clinic }
        : null,
    aiUsed: !!reading,
  };
}
