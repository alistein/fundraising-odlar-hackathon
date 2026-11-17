import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-sm px-2 text-sm font-semibold whitespace-nowrap [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        verified: "bg-lime text-lime-foreground",
        pending: "bg-warning text-warning-foreground",
        destructive: "bg-destructive-soft text-destructive",
        neutral: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
