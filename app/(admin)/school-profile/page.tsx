import { type Metadata } from "next"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "School Profile",
}

function SchoolProfilePage() {
  return (
    <>
      <AppHeader pageTitle="School Profile" />
      <AppContent>School Profile here</AppContent>
    </>
  )
}

export default SchoolProfilePage
