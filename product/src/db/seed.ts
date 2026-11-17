// Synthetic demo data only — no real people, clinics or accounts.
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db, schema } = await import("./index");
  const { appendLedgerEntry } = await import("../lib/ledger");

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
    { id: "org-1", name: "Aysel (təşkilatçı)", role: "organiser" },
    { id: "clinic-user-1", name: "Demo Mərkəzi Klinika", role: "clinic", clinicId: "clinic-1" },
    { id: "clinic-user-2", name: "Demo Uşaq Xəstəxanası", role: "clinic", clinicId: "clinic-2" },
    { id: "donor-1", name: "Rəşad (donor)", role: "donor" },
  ]);

  await db.insert(schema.campaigns).values([
    {
      id: "camp-verified",
      title: "Əlinin ürək əməliyyatı üçün yardım",
      story: "6 yaşlı Əlinin anadangəlmə ürək qüsuru var və əməliyyata ehtiyacı var.",
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
      id: "camp-pending",
      title: "Leylanın müalicəsi üçün dəstək",
      story: "Leylanın talassemiya müalicəsi üçün vəsait toplanır.",
      patientName: "Leyla H.",
      relation: "Ata",
      diagnosis: "Talassemiya",
      targetQepik: 1_800_000,
      organiserId: "org-1",
      clinicId: "clinic-2",
      status: "pending",
    },
  ]);

  await appendLedgerEntry({
    campaignId: "camp-verified",
    type: "donation",
    amountQepik: 5_000,
    label: "Anonim",
  });
  await appendLedgerEntry({
    campaignId: "camp-verified",
    type: "donation",
    amountQepik: 20_000,
    label: "Rəşad",
  });

  console.log("Seeded.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
