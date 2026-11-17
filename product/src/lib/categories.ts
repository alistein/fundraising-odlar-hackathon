import {
  BabyIcon,
  HeartPulseIcon,
  HospitalBed01Icon,
  KidneysIcon,
  RibbonIcon,
  WheelchairIcon,
} from "@hugeicons/core-free-icons";

// Categories are derived from a campaign's title, diagnosis and clinic, so no
// schema change is needed and one campaign can sit in several categories.
export const CATEGORIES = [
  { slug: "xerceng", name: "Xərçəng", icon: RibbonIcon, words: ["xərçəng", "leykemiya", "şiş", "onkolo", "limfoma"] },
  { slug: "urek", name: "Ürək", icon: HeartPulseIcon, words: ["ürək", "kardi"] },
  { slug: "transplantasiya", name: "Transplantasiya", icon: KidneysIcon, words: ["köçürülmə", "transplant"] },
  { slug: "usaqlar", name: "Uşaqlar", icon: BabyIcon, words: ["uşaq", "körpə", "yaşlı"] },
  { slug: "emeliyyat", name: "Əməliyyat", icon: HospitalBed01Icon, words: ["əməliyyat", "cərrah"] },
  { slug: "reabilitasiya", name: "Reabilitasiya", icon: WheelchairIcon, words: ["reabilitasiya", "sinir", "fizioterap", "skolioz"] },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const findCategory = (slug: string | undefined) => CATEGORIES.find((c) => c.slug === slug);

export function inCategory(slug: CategorySlug, ...texts: string[]): boolean {
  const hay = texts.join(" ").toLocaleLowerCase("az");
  return findCategory(slug)!.words.some((w) => hay.includes(w));
}
