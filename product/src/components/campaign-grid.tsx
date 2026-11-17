import { Hospital01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import type { listCampaigns } from "@/lib/campaigns";
import { formatAZN } from "@/lib/money";

type Row = Awaited<ReturnType<typeof listCampaigns>>[number];

export function CampaignGrid({ rows }: { rows: Row[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(({ campaign: c, clinicName, raisedQepik }) => (
        <li key={c.id}>
          <Link
            href={`/campaigns/${c.id}`}
            className="flex h-full flex-col rounded-2xl border bg-card p-5 text-left outline-none transition-[box-shadow,transform] duration-150 ease-out hover:shadow-strong focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
          >
            <StatusBadge status={c.status} />
            <h3 className="mt-4 text-xl font-bold">{c.title}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon icon={Hospital01Icon} size={16} />
              {clinicName}
            </p>
            <div className="mt-auto pt-8">
              <Progress value={raisedQepik} max={c.targetQepik} />
              <p className="mt-3 tabular-nums">
                <span className="font-bold">{formatAZN(raisedQepik)}</span>
                <span className="text-muted-foreground"> / {formatAZN(c.targetQepik)}</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
