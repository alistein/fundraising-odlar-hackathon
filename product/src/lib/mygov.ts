// SIMULATED MyGov identity check. There is no connection to the real MyGov
// (mygov.az) service: no request leaves this server. It answers from a flag
// the seed sets on demo users, so the pipeline has the step in place and the
// real integration can replace this one function.
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type IdentityCheck = { verified: boolean; simulated: true };

export async function checkOrganiserIdentity(userId: string): Promise<IdentityCheck> {
  const [user] = await db
    .select({ at: schema.users.mygovVerifiedAt })
    .from(schema.users)
    .where(eq(schema.users.id, userId));
  return { verified: !!user?.at, simulated: true };
}
