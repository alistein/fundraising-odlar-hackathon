import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { Mascot } from "@/components/mascot";
import { formatAZN } from "@/lib/money";
import { ConfirmForm } from "./confirm-form";

export default async function ClinicPage() {
  const user = await getSession();
  if (user?.role !== "clinic" || !user.clinicId)
    return <p className="text-muted-foreground">Klinika rolunu seçin.</p>;

  const pending = await db
    .select()
    .from(schema.campaigns)
    .where(and(eq(schema.campaigns.clinicId, user.clinicId), eq(schema.campaigns.status, "pending")));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="display text-4xl">Təsdiq gözləyənlər</h1>
      {pending.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Mascot mood="happy" size={88} />
          <p className="text-lg font-semibold">Hamısı yoxlanılıb</p>
        </div>
      )}
      <ul className="space-y-5">
        {pending.map((c) => (
          <li key={c.id} className="rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-xl font-bold">
                <Link href={`/campaigns/${c.id}`} className="underline-offset-4 hover:underline">
                  {c.title}
                </Link>
              </h2>
              <p className="text-xl font-bold tabular-nums">{formatAZN(c.targetQepik)}</p>
            </div>
            <p className="mt-1 text-muted-foreground">
              {c.patientName} · {c.diagnosis}
            </p>
            <ConfirmForm campaignId={c.id} defaultCostAzn={c.targetQepik / 100} />
          </li>
        ))}
      </ul>
    </div>
  );
}
