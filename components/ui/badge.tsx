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
        MALE: "bg-blue-800/30 border-none text-blue-500 capitalize",
        FEMALE: "bg-rose-800/30 border-none text-rose-400 capitalize",
        Male: "bg-blue-800/30 border-none text-blue-500 capitalize",
        Female: "bg-rose-800/30 border-none text-rose-400 capitalize",
        code: "border-secondary bg-secondary/30 px-0.5 font-mono",
        success:
          "border-none bg-emerald-800/30 px-1.5 text-emerald-500 capitalize",
        warn: "border-none bg-yellow-800/30 px-1.5 text-yellow-500 capitalize",
        REGISTERED:
          "border-none bg-blue-800/30 text-blue-500 px-1.5 capitalize",
        ENROLLED:
          "border-none bg-emerald-800/30 px-1.5 text-emerald-500 capitalize",
        TRANSFERRED: "border-none bg-black/30 px-1.5 text-white capitalize",
        DROPPED: "border-none bg-red-800/30 px-1.5 text-red-500 capitalize",
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
