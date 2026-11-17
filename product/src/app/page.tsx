import Link from "next/link";
import { CheckForm } from "@/components/check-form";
import { Icon } from "@/components/icon";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-28">
      <div className="mx-auto max-w-2xl pt-4 text-center sm:pt-10">
        <CheckForm />
      </div>

      <section className="space-y-6">
        <h2 className="display text-3xl sm:text-4xl">Kateqoriyalar</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/campaigns?kateqoriya=${c.slug}`}
                className="press flex flex-col items-center gap-3 rounded-3xl border bg-card px-3 py-6 text-center font-semibold outline-none hover:shadow-strong focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <span className="grid size-14 place-items-center rounded-full bg-lime text-lime-foreground">
                  <Icon icon={c.icon} size={28} />
                </span>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
