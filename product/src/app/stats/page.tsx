import {
  Alert02Icon,
  CheckmarkBadge01Icon,
  CreditCardNotAcceptIcon,
  Search01Icon,
  Shield01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { formatAZN } from "@/lib/money";
import { getStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export default async function StatsPage() {
  const s = await getStats();

  const tiles = [
    { label: "Toplanan ianə", value: formatAZN(s.raisedQepik), icon: Wallet01Icon },
    { label: "Təsdiqlənmiş kampaniya", value: s.verifiedCampaigns, icon: CheckmarkBadge01Icon },
    { label: "Yoxlama", value: s.checks, icon: Search01Icon },
    { label: "Aşkarlanan fırıldaq", value: s.frauds, icon: Alert02Icon, danger: true },
    { label: "Qara siyahıda kart", value: s.blacklisted, icon: CreditCardNotAcceptIcon, danger: true },
    { label: "Qorunan məbləğ", value: formatAZN(s.protectedQepik), icon: Shield01Icon },
  ];

  return (
    <div className="space-y-10">
      <h1 className="display text-4xl sm:text-6xl">Statistika</h1>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-3xl border bg-card p-5 sm:p-7">
            <span
              className={cn(
                "grid size-10 place-items-center rounded-full",
                t.danger ? "bg-destructive-soft text-destructive" : "bg-lime text-lime-foreground",
              )}
            >
              <Icon icon={t.icon} size={20} />
            </span>
            <p className="display mt-5 text-2xl tabular-nums sm:text-4xl">{t.value}</p>
            <p className="mt-1 font-semibold text-muted-foreground">{t.label}</p>
          </div>
        ))}
      </section>

      {s.recent.length > 0 && (
        <section className="space-y-4">
          <h2 className="display text-2xl sm:text-3xl">Son aşkarlananlar</h2>
          <ul className="divide-y overflow-hidden rounded-3xl border bg-card">
            {s.recent.map((r) => (
              <li key={r.id} className="flex items-center gap-4 px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-destructive-soft text-destructive">
                  <Icon icon={Alert02Icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(r.at).toLocaleString("az-AZ", {
                      timeZone: "Asia/Baku",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                {r.last4 && (
                  <span className="font-mono text-sm text-muted-foreground max-sm:hidden">
                    •••• {r.last4}
                  </span>
                )}
                {r.amountQepik ? (
                  <span className="shrink-0 font-bold tabular-nums">{formatAZN(r.amountQepik)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
