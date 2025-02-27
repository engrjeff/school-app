import * as React from "react"

import { ThemeToggler } from "./theme-toggler"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export function AppHeader({
  pageTitle,
  children,
}: React.PropsWithChildren<{ pageTitle?: string }>) {
  return (
    <header className="bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {pageTitle && <h1 className="font-semibold">{pageTitle}</h1>}
        {children}
        <div className="ml-auto">
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}
