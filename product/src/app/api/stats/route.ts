import { handler } from "@/lib/api";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

// Public: platform totals for the Statistika page.
export const GET = handler(async () => Response.json(await getStats()));
