import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getSession } from "@/auth"
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

  const session = await getSession()

  return (
    <>
      <AppHeader pageTitle="School Profile" />
      <AppContent>
        <SchoolProfileForm role={session?.user.role} school={school} />
      </AppContent>
    </>
  )
}

export default SchoolProfilePage
