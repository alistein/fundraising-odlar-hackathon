// Synthetic demo data only — no real people, clinics or accounts.
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db, schema } = await import("./index");
  const { appendLedgerEntry } = await import("../lib/ledger");
  const { routeHash } = await import("../lib/crypto");
  const { storyTokens } = await import("../lib/checker/text");

  await db.delete(schema.appeals);
  await db.delete(schema.ledgerEntries);
  await db.delete(schema.documents);
  await db.delete(schema.campaigns);
  await db.delete(schema.users);
  await db.delete(schema.clinics);

  await db.insert(schema.clinics).values([
    { id: "clinic-1", name: "Demo Mərkəzi Klinika", iban: "AZ00DEMO00000000000000000001" },
    { id: "clinic-2", name: "Demo Uşaq Xəstəxanası", iban: "AZ00DEMO00000000000000000002" },
  ]);

  await db.insert(schema.users).values([
    { id: "org-1", name: "Aysel (təşkilatçı)", role: "organiser", mygovVerifiedAt: new Date() },
    { id: "clinic-user-1", name: "Demo Mərkəzi Klinika", role: "clinic", clinicId: "clinic-1" },
    { id: "clinic-user-2", name: "Demo Uşaq Xəstəxanası", role: "clinic", clinicId: "clinic-2" },
    { id: "donor-1", name: "Rəşad (donor)", role: "donor" },
  ]);

  // Synthetic card numbers, used only as demo identifiers.
  const LEYLA_CARD = "4169738812345678";
  const SERIAL_CARD = "5522091144556677";

  await db.insert(schema.campaigns).values([
    {
      id: "camp-verified",
      code: "SF-4821",
      title: "Əlinin ürək əməliyyatı üçün yardım",
      story:
        "6 yaşlı Əlinin anadangəlmə ürək qüsuru var və təcili açıq ürək əməliyyatına ehtiyacı var. Həkimlər əməliyyatın yaxın aylarda edilməsini məsləhət görür. Ailə xərci təkbaşına ödəyə bilmir.",
      patientName: "Əli M.",
      relation: "Ana",
      diagnosis: "Anadangəlmə ürək qüsuru",
      targetQepik: 2_500_000,
      organiserId: "org-1",
      clinicId: "clinic-1",
      status: "verified",
      confirmedCostQepik: 2_500_000,
      confirmedAt: new Date(),
    },
    {
      id: "camp-murad",
      code: "SF-5540",
      title: "Muradın onurğa əməliyyatı",
      story:
        "14 yaşlı Muradda ağır skolioz aşkarlanıb və onurğa sütununda düzəldici əməliyyat tələb olunur. Əməliyyat edilməsə Murad gəzmək qabiliyyətini itirə bilər. Valideynləri kömək üçün müraciət edir.",
      patientName: "Murad Q.",
      relation: "Ata",
      diagnosis: "Ağır skolioz",
      targetQepik: 3_200_000,
      organiserId: "org-1",
      clinicId: "clinic-1",
      status: "verified",
      confirmedCostQepik: 3_200_000,
      confirmedAt: new Date(),
    },
    {
      id: "camp-closed",
      code: "SF-1094",
      title: "Nərminin böyrək köçürülməsi",
      story:
        "9 yaşlı Nərminin xroniki böyrək çatışmazlığı var və böyrək köçürülməsi əməliyyatı lazımdır. Donor tapılıb, əməliyyat üçün vəsait toplanırdı. Yığım başa çatıb və Nərmin əməliyyat olunub.",
      patientName: "Nərmin S.",
      relation: "Ana",
      diagnosis: "Xroniki böyrək çatışmazlığı",
      targetQepik: 4_000_000,
      organiserId: "org-1",
      clinicId: "clinic-2",
      status: "verified",
      confirmedCostQepik: 4_000_000,
      confirmedAt: new Date(),
      closedAt: new Date(),
    },
    {
      id: "camp-pending",
      code: "SF-3307",
      title: "Leylanın müalicəsi üçün dəstək",
      story:
        "11 yaşlı Leylanın talassemiya xəstəliyi var və hər ay qan köçürülməsi ilə yanaşı sümük iliyi transplantasiyasına ehtiyacı var. Ailə müalicə üçün vəsait toplayır.",
      patientName: "Leyla H.",
      relation: "Ata",
      diagnosis: "Talassemiya",
      targetQepik: 1_800_000,
      organiserId: "org-1",
      clinicId: "clinic-2",
      status: "pending",
      declaredRouteHash: routeHash(LEYLA_CARD),
      declaredRouteLast4: LEYLA_CARD.slice(-4),
    },
    {
      id: "camp-rejected",
      code: "SF-2210",
      title: "Aytacın xaricdə müalicəsi",
      story:
        "Aytacın nadir sinir xəstəliyi olduğu və xaricdə bahalı müalicəyə ehtiyacı olduğu bildirilir. Təşkilatçı təcili yardım istəyir.",
      patientName: "Aytac R.",
      relation: "Xala",
      diagnosis: "Nadir sinir xəstəliyi",
      targetQepik: 9_000_000,
      organiserId: "org-1",
      clinicId: "clinic-1",
      status: "rejected",
    },
  ]);

  for (const [campaignId, amountQepik, label] of [
    ["camp-verified", 5_000, "Anonim"],
    ["camp-verified", 20_000, "Rəşad"],
    ["camp-murad", 50_000, "Anonim"],
    ["camp-closed", 4_000_000, "Anonim"],
  ] as const)
    await appendLedgerEntry({ campaignId, type: "donation", amountQepik, label });

  // Memory of earlier checks, so the checker has something to remember.
  const route = (card: string) => ({
    kind: "card" as const,
    hash: routeHash(card),
    last4: card.slice(-4),
  });
  const yusif =
    "Təcili! 4 yaşlı Yusifin leykemiya xəstəliyi var, kimyaterapiya üçün pul çatmır. Hər qəpik vacibdir, paylaşın.";
  const zehra =
    "Balaca Zəhra evdə yanğın zamanı ağır yanıq alıb, dəri köçürülməsi əməliyyatı lazımdır. Kömək edin.";
  const kenan =
    "7 yaşlı Kənanın gözündə şiş aşkarlanıb, görmə qabiliyyətini itirməməsi üçün təcili göz əməliyyatı olunmalıdır.";
  await db.insert(schema.appeals).values([
    { tokens: storyTokens(yusif), routes: [route(SERIAL_CARD)], verdict: "unknown" },
    { tokens: storyTokens(zehra), routes: [route(SERIAL_CARD)], verdict: "serial_card", amountQepik: 1_200_000 },
    { tokens: storyTokens(kenan), routes: [route("4127001122334455")], verdict: "unknown" },
    { tokens: storyTokens(kenan), routes: [route("5103998877665544")], verdict: "multi_route", amountQepik: 850_000 },
  ]);

  console.log("Seeded.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
