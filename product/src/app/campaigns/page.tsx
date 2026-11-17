import Link from "next/link";
import { Icon } from "@/components/icon";
import { Mascot } from "@/components/mascot";
import { CampaignGrid } from "@/components/campaign-grid";
import { listCampaigns } from "@/lib/campaigns";
import { CATEGORIES, findCategory, inCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

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
      <CampaignGrid rows={rows} />
    </div>
  );
}
