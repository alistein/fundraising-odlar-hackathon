import { randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, organiserOrDemo } from "@/lib/auth";
import { listCampaigns } from "@/lib/campaigns";
import { aznToQepik } from "@/lib/money";

export const GET = handler(async () => Response.json({ campaigns: await listCampaigns() }));

const Body = z.object({
  title: z.string().min(3).max(120),
  story: z.string().min(10).max(4000),
  patientName: z.string().min(2).max(80),
  relation: z.string().min(2).max(40),
  diagnosis: z.string().min(2).max(200),
  targetAzn: z.number().positive().max(10_000_000),
  clinicId: z.string().min(1),
  // No card: donations are paid out through Safefund, never to a personal card.
});

// Organiser opens a campaign. It starts "pending" and cannot collect until it passes
// both gates: the AI check (/ai-gate) and MyGov identity (/identity).
export const POST = handler(async (req: Request) => {
  const user = await organiserOrDemo();
  const body = Body.parse(await req.json());

  const [clinic] = await db.select().from(schema.clinics).where(eq(schema.clinics.id, body.clinicId));
  if (!clinic) throw new HttpError(400, "Klinika tapılmadı");

  const [campaign] = await db
    .insert(schema.campaigns)
    .values({
      title: body.title,
      story: body.story,
      patientName: body.patientName,
      relation: body.relation,
      diagnosis: body.diagnosis,
      targetQepik: aznToQepik(body.targetAzn),
      clinicId: clinic.id,
      organiserId: user.id,
      code: `SF-${randomInt(1000, 10000)}`,
    })
    .returning();
  return Response.json({ campaign }, { status: 201 });
});
