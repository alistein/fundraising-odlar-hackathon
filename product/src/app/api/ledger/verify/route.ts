import { handler } from "@/lib/api";
import { verifyChain } from "@/lib/ledger";

// Public: recomputes the whole hash chain and reports the first broken entry.
export const GET = handler(async () => Response.json(await verifyChain()));
