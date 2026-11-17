import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

// One place for icon defaults so stroke weight stays consistent.
export function Icon({
  icon,
  size = 18,
  className,
}: {
  icon: IconSvgElement;
  size?: number;
  className?: string;
}) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.75} className={className} />;
}
