// MOCK AUTH: picks one of the seeded demo users. No password.
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, schema } from "@/db";
import { handler } from "@/lib/api";
import { HttpError, SESSION_COOKIE } from "@/lib/auth";

const Body = z.object({ userId: z.string().min(1) });

export const POST = handler(async (req: Request) => {
  const { userId } = Body.parse(await req.json());
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
  if (!user) throw new HttpError(404, "İstifadəçi tapılmadı");
  (await cookies()).set(SESSION_COOKIE, user.id, { httpOnly: true, sameSite: "lax", path: "/" });
  return Response.json({ user });
});
