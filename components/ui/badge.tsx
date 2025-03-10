import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        MALE: "bg-blue-400/10 border-blue-400/20 text-blue-400 capitalize",
        FEMALE: "bg-rose-400/10 border-rose-400/20 text-rose-400 capitalize",
        Male: "bg-blue-400/10 border-blue-400/20 text-blue-400 capitalize",
        Female: "bg-rose-400/10 border-rose-400/20 text-rose-400 capitalize",
        code: "border-secondary bg-secondary/30 px-0.5 font-mono",
        REGISTERED: "border-secondary bg-secondary/30 px-0.5 capitalize",
        ENROLLED:
          "border-none bg-emerald-500/30 px-1 text-emerald-500 capitalize",
        TRANSFERRED: "border-none bg-black/30 px-1 text-white capitalize",
        DROPPED: "border-none bg-red-500/30 px-1 text-red-500 capitalize",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
