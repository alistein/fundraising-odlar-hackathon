import { z } from "zod";
import { handler } from "@/lib/api";
import { lookupFin } from "@/lib/mygov";

const Body = z.object({
  fin: z.string().trim().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// MOCK MyGov sandbox: confirms any FIN and name; nothing leaves this server.
export const POST = handler(async (req: Request) => {
  const { fin, firstName, lastName } = Body.parse(await req.json());
  return Response.json(lookupFin(fin, firstName, lastName));
});
