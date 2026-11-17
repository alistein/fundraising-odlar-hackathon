import { Hospital01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Mascot } from "@/components/mascot";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { listCampaigns } from "@/lib/campaigns";
import { CATEGORIES, findCategory, inCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { formatAZN } from "@/lib/money";

export default async function Campaigns({ searchParams }: PageProps<"/campaigns">) {
  const { kateqoriya } = await searchParams;
  const category = findCategory(typeof kateqoriya === "string" ? kateqoriya : undefined);
  const all = await listCampaigns();
  const rows = category
    ? all.filter((r) => inCategory(category.slug, r.campaign.title, r.campaign.diagnosis, r.clinicName))
    : all;

  const chip = (active: boolean) =>
    cn(
      "press inline-flex h-10 items-center rounded-full border px-4 font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
      active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
    );

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <h1 className="display text-4xl sm:text-6xl">{category?.name ?? "Kampaniyalar"}</h1>
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href="/campaigns" className={chip(!category)}>
            Hamısı
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/campaigns?kateqoriya=${c.slug}`}
              className={cn(chip(category?.slug === c.slug), "shrink-0 gap-2")}
            >
              <Icon icon={c.icon} size={18} />
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <Mascot size={72} mood="thinking" />
          <p className="text-lg font-semibold">Kampaniya yoxdur</p>
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ campaign: c, clinicName, raisedQepik }) => (
          <li key={c.id}>
            <Link
              href={`/campaigns/${c.id}`}
              className="flex h-full flex-col rounded-2xl border bg-card p-5 outline-none transition-[box-shadow,transform] duration-150 ease-out hover:shadow-strong focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.99]"
            >
              <StatusBadge status={c.status} />
              <h2 className="mt-4 text-xl font-bold">{c.title}</h2>
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
    </div>
  );
}
