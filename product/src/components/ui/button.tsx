import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

// Pill buttons. Feedback is on press (scale), never `transition-all`.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none outline-none transition-[transform,background-color,box-shadow,color] duration-100 ease-out active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "bg-background text-foreground shadow-[inset_0_0_0_1px_var(--input)] hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-border",
        ghost: "text-foreground hover:bg-secondary",
        destructive:
          "bg-background text-destructive shadow-[inset_0_0_0_1px_var(--input)] hover:bg-destructive-soft hover:shadow-[inset_0_0_0_1px_var(--destructive)]",
        link: "text-foreground underline underline-offset-4",
      },
      size: {
        sm: "h-8 px-4 text-sm",
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
