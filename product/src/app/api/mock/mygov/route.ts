import { z } from "zod";
import { handler } from "@/lib/api";
import { FIN_PATTERN, lookupFin } from "@/lib/mygov";

const Body = z.object({
  fin: z.string().trim().toUpperCase().regex(FIN_PATTERN),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// MOCK MyGov sandbox: synthetic people only, nothing leaves this server.
export const POST = handler(async (req: Request) => {
  const { fin, firstName, lastName } = Body.parse(await req.json());
  return Response.json(lookupFin(fin, firstName, lastName));
});
