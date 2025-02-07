import React, { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function AppContent(
  props: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>
) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-4", props.className)}>
      {props.children}
    </div>
  )
}
