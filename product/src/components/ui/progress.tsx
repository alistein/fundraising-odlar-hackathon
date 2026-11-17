import * as React from "react"
import { cn } from "@/lib/utils"

// Fills with transform (compositor only). Grows once on mount via @starting-style.
function Progress({
  value,
  max,
  className,
}: {
  value: number
  max: number
  className?: string
}) {
  const p = max > 0 ? Math.min(value / max, 1) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(p * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
    >
      <div
        className="h-full origin-left rounded-full bg-linear-to-r from-(--progress-from) to-(--progress-to) transition-transform duration-1000 ease-default starting:scale-x-0"
        style={{ transform: `scaleX(${Math.max(p, p > 0 ? 0.02 : 0)})` }}
      />
    </div>
  )
}

export { Progress }
