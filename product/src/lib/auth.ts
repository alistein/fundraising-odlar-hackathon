// MOCK AUTH — hackathon demo only. The cookie holds a seeded user id and is
// trusted as-is. There are no passwords. Do not ship this.
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, schema } from "@/db";
import type { User } from "@/db/schema";

export const SESSION_COOKIE = "demo_user";

export async function getSession(): Promise<User | null> {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return user ?? null;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function requireRole(...roles: User["role"][]): Promise<User> {
  const user = await getSession();
  if (!user) throw new HttpError(401, "Daxil olmamısınız");
  if (!roles.includes(user.role)) throw new HttpError(403, "Bu əməliyyat üçün icazəniz yoxdur");
  return user;
}
