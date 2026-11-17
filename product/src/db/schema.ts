import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["organiser", "clinic", "donor"]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "pending", // waiting for clinic confirmation — cannot collect
  "verified", // clinic confirmed diagnosis and cost — live
  "rejected",
]);
export const ledgerTypeEnum = pgEnum("ledger_type", ["donation", "payout"]);
export const docCheckEnum = pgEnum("doc_check", ["pending", "clean", "flagged"]);

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

export const clinics = pgTable("clinics", {
  id: id(),
  name: text("name").notNull(),
  // Fake account for the demo. Donations are routed here, never to a person.
  iban: text("iban").notNull(),
});

export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  role: roleEnum("role").notNull(),
  clinicId: text("clinic_id").references(() => clinics.id),
});

export const campaigns = pgTable("campaigns", {
  id: id(),
  title: text("title").notNull(),
  story: text("story").notNull(),
  patientName: text("patient_name").notNull(),
  relation: text("relation").notNull(), // organiser's relation to the patient
  diagnosis: text("diagnosis").notNull(),
  targetQepik: integer("target_qepik").notNull(), // money is stored in qəpik
  organiserId: text("organiser_id")
    .notNull()
    .references(() => users.id),
  clinicId: text("clinic_id")
    .notNull()
    .references(() => clinics.id),
  status: campaignStatusEnum("status").notNull().default("pending"),
  confirmedCostQepik: integer("confirmed_cost_qepik"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const documents = pgTable("documents", {
  id: id(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  kind: text("kind").notNull(), // "certificate" | "invoice"
  filename: text("filename").notNull(),
  sha256: text("sha256").notNull(), // hash of the plaintext, for reuse detection
  blobUrl: text("blob_url").notNull(), // ciphertext location
  iv: text("iv").notNull(),
  authTag: text("auth_tag").notNull(),
  checkStatus: docCheckEnum("check_status").notNull().default("pending"),
  checkSignals: jsonb("check_signals").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Append-only hash chain. Never UPDATE or DELETE rows here.
export const ledgerEntries = pgTable("ledger_entries", {
  seq: integer("seq").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  type: ledgerTypeEnum("type").notNull(),
  amountQepik: integer("amount_qepik").notNull(),
  label: text("label").notNull(), // donor display name, or clinic name for payouts
  createdAt: text("created_at").notNull(), // ISO string, hashed verbatim
  prevHash: text("prev_hash").notNull(),
  hash: text("hash").notNull(),
});

export type User = typeof users.$inferSelect;
export type Clinic = typeof clinics.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type LedgerEntry = typeof ledgerEntries.$inferSelect;
