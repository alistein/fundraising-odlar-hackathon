import { Cancel01Icon, CheckmarkBadge01Icon, HourglassIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from "@/db/schema";

const map = {
  verified: { label: "Təsdiqlənib", variant: "verified", icon: CheckmarkBadge01Icon },
  pending: { label: "Yoxlanılır", variant: "pending", icon: HourglassIcon },
  rejected: { label: "Rədd edilib", variant: "destructive", icon: Cancel01Icon },
} as const;

export function StatusBadge({ status }: { status: Campaign["status"] }) {
  const s = map[status];
  return (
    <Badge variant={s.variant}>
      <Icon icon={s.icon} size={14} />
      {s.label}
    </Badge>
  );
}
