import { type Metadata } from "next"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

function AdminDashboardPage() {
  return (
    <>
      <AppHeader pageTitle="Dashboard" />
      <AppContent>Dashboard here</AppContent>
    </>
  )
}

export default AdminDashboardPage
