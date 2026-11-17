import { Hospital01Icon, HourglassIcon } from "@hugeicons/core-free-icons";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { Progress } from "@/components/ui/progress";
import { db, schema } from "@/db";
import { getCampaign } from "@/lib/campaigns";
import { formatAZN } from "@/lib/money";
import { DonateForm } from "./donate-form";

export default async function CampaignPage({ params }: PageProps<"/campaigns/[id]">) {
  const { id } = await params;
  const row = await getCampaign(id);
  if (!row) notFound();
  const { campaign: c, clinicName, raisedQepik } = row;

  const ledger = await db
    .select()
    .from(schema.ledgerEntries)
    .where(eq(schema.ledgerEntries.campaignId, id))
    .orderBy(desc(schema.ledgerEntries.seq));

  const facts: [string, string][] = [
    ["Xəstə", c.patientName],
    ["Diaqnoz", c.diagnosis],
    ["Təşkilatçı", c.relation],
    ["Təsdiqlənmiş xərc", c.confirmedCostQepik ? formatAZN(c.confirmedCostQepik) : "—"],
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      <article className="min-w-0">
        <StatusBadge status={c.status} />
        <h1 className="display mt-4 text-3xl sm:text-5xl">{c.title}</h1>
        <p className="mt-4 flex items-center gap-2 font-semibold">
          <Icon icon={Hospital01Icon} size={20} />
          {clinicName}
        </p>
        <p className="mt-8 text-lg text-foreground/80">{c.story}</p>

        <dl className="mt-10 divide-y border-y">
          {facts.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-6 py-4">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        {ledger.length > 0 && (
          <ul className="mt-10 space-y-5">
            {ledger.map((e) => (
              <li key={e.seq} className="flex items-center gap-3">
                <UserAvatar seed={e.label === "Anonim" ? e.hash : e.label} name={e.label} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{e.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{e.hash.slice(0, 12)}</p>
                </div>
                <p className="font-bold tabular-nums">{formatAZN(e.amountQepik)}</p>
              </li>
            ))}
          </ul>
        )}
      </article>

      <aside className="h-fit rounded-3xl border bg-card p-6 shadow-strong lg:sticky lg:top-24">
        <p className="display text-4xl tabular-nums">{formatAZN(raisedQepik)}</p>
        <p className="mt-1 text-muted-foreground tabular-nums">/ {formatAZN(c.targetQepik)}</p>
        <Progress value={raisedQepik} max={c.targetQepik} className="mt-5" />
        <div className="mt-6">
          {c.status === "verified" ? (
            <DonateForm campaignId={c.id} />
          ) : (
            <p className="flex items-center gap-2 rounded-xl bg-warning p-4 font-semibold text-warning-foreground">
              <Icon icon={HourglassIcon} size={20} />
              Klinika təsdiqi gözlənilir
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
