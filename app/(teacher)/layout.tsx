import * as React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebarServer } from "@/components/app-sidebar.server"

function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebarServer />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default TeacherLayout
