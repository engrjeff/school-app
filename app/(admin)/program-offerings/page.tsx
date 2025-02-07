import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { ProgramOfferingForm } from "@/features/programs/program-offering-form"
import { ProgramOfferingsTable } from "@/features/programs/program-offerings-table"
import { getSchoolOfUser } from "@/features/school/queries"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Program Offerings",
}

async function ProgramOfferingsPage() {
  const { school } = await getSchoolOfUser()

  if (!school) return notFound()

  return (
    <>
      <AppHeader pageTitle="Program Offerings" />

      <AppContent>
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-sm">
            Programs offered by{" "}
            <span className="text-primary font-medium">{school?.name}</span>
          </h2>
          <ProgramOfferingForm />
        </div>
        <ProgramOfferingsTable programOfferings={school?.programOfferings} />
      </AppContent>
    </>
  )
}

export default ProgramOfferingsPage
