// MOCK MyGov sandbox. There is no connection to the real MyGov (mygov.az)
// service: no request leaves this server. It answers from the synthetic
// registry below, so the identity gate can be demoed and the real integration
// can later replace lookupFin().
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type MockPerson = {
  fin: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: "active" | "inactive";
};

// Synthetic people only. None of these FINs or names belong to a real person.
export const MOCK_PEOPLE: MockPerson[] = [
  { fin: "5AZ7K2P", firstName: "Aysel", lastName: "Məmmədova", birthDate: "1990-04-12", status: "active" },
  { fin: "3QW9L4T", firstName: "Rəşad", lastName: "Hüseynov", birthDate: "1985-09-03", status: "active" },
  { fin: "8MN2X6R", firstName: "Leyla", lastName: "Quliyeva", birthDate: "1993-01-27", status: "active" },
  { fin: "1DE5F8H", firstName: "Kamran", lastName: "Əliyev", birthDate: "1978-11-15", status: "inactive" },
];

export const FIN_PATTERN = /^[0-9A-Z]{7}$/;

export type MygovResult =
  | { outcome: "found"; person: Omit<MockPerson, "fin"> }
  | { outcome: "not_found" }
  | { outcome: "name_mismatch" }
  | { outcome: "inactive" };

const norm = (s: string) => s.trim().toLocaleLowerCase("az").replace(/\s+/g, " ");

export function lookupFin(fin: string, firstName?: string, lastName?: string): MygovResult {
  const person = MOCK_PEOPLE.find((p) => p.fin === fin.trim().toUpperCase());
  if (!person) return { outcome: "not_found" };
  if (person.status !== "active") return { outcome: "inactive" };
  if (
    (firstName !== undefined && norm(firstName) !== norm(person.firstName)) ||
    (lastName !== undefined && norm(lastName) !== norm(person.lastName))
  )
    return { outcome: "name_mismatch" };
  const { firstName: f, lastName: l, birthDate, status } = person;
  return { outcome: "found", person: { firstName: f, lastName: l, birthDate, status } };
}

export async function campaignIdentity(campaignId: string): Promise<{ verified: boolean; simulated: true }> {
  const [c] = await db
    .select({ at: schema.campaigns.identityVerifiedAt })
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, campaignId));
  return { verified: !!c?.at, simulated: true };
}
