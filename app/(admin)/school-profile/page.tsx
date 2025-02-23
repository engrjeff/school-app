import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getSchoolOfUser } from "@/features/school/queries"
import { SchoolProfileForm } from "@/features/school/school-profile-form"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "School Profile",
}

async function SchoolProfilePage() {
  const { school } = await getSchoolOfUser()

  if (!school) return notFound()

  return (
    <>
      <AppHeader pageTitle="School Profile" />
      <AppContent>
        <SchoolProfileForm school={school} />
      </AppContent>
    </>
  )
}

export default SchoolProfilePage
