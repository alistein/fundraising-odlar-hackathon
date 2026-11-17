import {
  Alert02Icon,
  CheckmarkBadge01Icon,
  File01Icon,
  Hospital01Icon,
  HourglassIcon,
  IdentityCardIcon,
} from "@hugeicons/core-free-icons";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Progress } from "@/components/ui/progress";
import { db, schema } from "@/db";
import { getCampaign } from "@/lib/campaigns";
import { formatAZN } from "@/lib/money";
import { getSession } from "@/lib/auth";
import { DocumentConfirm } from "./document-confirm";
import { DocumentUpload } from "./document-upload";
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

  // Medical documents are shown only to the organiser who uploaded them and to the verifying clinic.
  const user = await getSession();
  const isOwner = user?.role === "organiser" && user.id === c.organiserId;
  const isClinic = user?.role === "clinic" && user.clinicId === c.clinicId;
  const documents =
    isOwner || isClinic
      ? await db
          .select({
            id: schema.documents.id,
            filename: schema.documents.filename,
            checkStatus: schema.documents.checkStatus,
            checkSignals: schema.documents.checkSignals,
            code: schema.documents.code,
          })
          .from(schema.documents)
          .where(eq(schema.documents.campaignId, id))
          .orderBy(desc(schema.documents.createdAt))
      : [];

  const facts: [string, string][] = [
    ["Xəstə", c.patientName],
    ["Diaqnoz", c.diagnosis],
    ["Təşkilatçı", c.relation],
    ["Təsdiqlənmiş xərc", c.confirmedCostQepik ? formatAZN(c.confirmedCostQepik) : "—"],
  ];
  if (c.declaredRouteLast4) facts.push(["Bəyan edilmiş kart", `•••• ${c.declaredRouteLast4}`]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
      <article className="min-w-0">
        <div className="flex items-center gap-2">
          <StatusBadge status={c.status} />
          {c.identityVerifiedAt && (
            <Badge variant="verified">
              <Icon icon={IdentityCardIcon} size={14} />
              MyGov
            </Badge>
          )}
          {c.code && <Badge className="font-mono">{c.code}</Badge>}
        </div>
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

        {(isOwner || isClinic) && (
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-bold">Sənədlər</h2>
            <ul className="space-y-3">
              {documents.map((d) => (
                <li key={d.id} className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Icon icon={File01Icon} size={20} />
                    {isClinic ? (
                      <a
                        href={`/api/documents/${d.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 flex-1 truncate font-semibold underline-offset-4 hover:underline"
                      >
                        {d.filename}
                      </a>
                    ) : (
                      <p className="min-w-0 flex-1 truncate font-semibold">{d.filename}</p>
                    )}
                    <Badge variant={d.checkStatus === "flagged" ? "destructive" : "verified"}>
                      <Icon icon={d.checkStatus === "flagged" ? Alert02Icon : CheckmarkBadge01Icon} />
                      {d.checkStatus === "flagged" ? "Şübhəli" : "Təmiz"}
                    </Badge>
                    {d.code ? (
                      <Link href={`/d/${d.code}`} className="press rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
                        <Badge className="font-mono">{d.code}</Badge>
                      </Link>
                    ) : (
                      isClinic && <DocumentConfirm documentId={d.id} />
                    )}
                  </div>
                  {d.checkSignals.length > 0 && (
                    <ul className="mt-3 space-y-1 text-destructive">
                      {d.checkSignals.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            {isOwner && <DocumentUpload campaignId={c.id} />}
          </section>
        )}

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
          {!c.identityVerifiedAt && c.status !== "rejected" && (
            <Button asChild variant="outline" size="lg" className="mt-3 w-full">
              <Link href={`/mygov?kampaniya=${c.id}`}>
                <Icon icon={IdentityCardIcon} size={20} />
                MyGov ilə təsdiqlə
              </Link>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
