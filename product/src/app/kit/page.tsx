/* eslint-disable @next/next/no-img-element */
import { KitMoods } from "./kit-moods";

const COLOURS: [string, string][] = [
  ["--mascot-face", "#ccf88e"],
  ["--mascot-ink", "#274a34"],
  ["--mascot-cheek", "#acf86c"],
  ["--background", "#ffffff"],
  ["--secondary", "#f4f2ec"],
  ["--destructive", "#c8321f"],
];

const FILES = [
  ["safefund-horizontal.svg", "bg-background"],
  ["safefund-stacked.svg", "bg-background"],
  ["safefund-horizontal-white.svg", "bg-primary"],
  ["safefund-mascot-mono.svg", "bg-secondary"],
  ["safefund-app-icon.svg", "bg-background"],
  ["safefund-mascot-small.svg", "bg-background"],
] as const;

export const metadata = { title: "Safefund kit" };

export default function KitPage() {
  return (
    <div className="space-y-16">
      <h1 className="display text-4xl sm:text-6xl">Kit</h1>

      <KitMoods />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FILES.map(([file, bg]) => (
          <a
            key={file}
            href={`/brand/${file}`}
            download
            className={`flex aspect-[4/3] items-center justify-center rounded-2xl border p-10 transition-[box-shadow,transform] duration-150 ease-out hover:shadow-strong active:scale-[0.99] ${bg}`}
          >
            <img src={`/brand/${file}`} alt={file} className="max-h-full max-w-full" />
          </a>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {COLOURS.map(([token, hex]) => (
          <div key={token} className="overflow-hidden rounded-2xl border">
            <div className="h-24" style={{ background: `var(${token})` }} />
            <div className="p-3">
              <p className="font-mono text-xs">{token}</p>
              <p className="font-mono text-xs text-muted-foreground">{hex}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
