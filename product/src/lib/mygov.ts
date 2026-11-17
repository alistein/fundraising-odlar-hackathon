// MOCK MyGov sandbox. There is no connection to the real MyGov (mygov.az)
// service: no request leaves this server. For the demo it confirms ANY FIN and
// name it is given, so the identity gate can be shown with made-up values. The
// real integration replaces lookupFin().
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type MygovResult = {
  outcome: "found";
  person: { firstName: string; lastName: string; status: "active" };
  simulated: true;
};

export function lookupFin(_fin: string, firstName = "", lastName = ""): MygovResult {
  return {
    outcome: "found",
    person: { firstName: firstName.trim(), lastName: lastName.trim(), status: "active" },
    simulated: true,
  };
}

export async function campaignIdentity(campaignId: string): Promise<{ verified: boolean; simulated: true }> {
  const [c] = await db
    .select({ at: schema.campaigns.identityVerifiedAt })
    .from(schema.campaigns)
    .where(eq(schema.campaigns.id, campaignId));
  return { verified: !!c?.at, simulated: true };
}
