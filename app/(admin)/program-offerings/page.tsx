import { type Metadata } from "next"
import Link from "next/link"
import { ProgramOfferingForm } from "@/features/programs/program-offering-form"
import { ProgramOfferingsTable } from "@/features/programs/program-offerings-table"
import { getPrograms, GetProgramsArgs } from "@/features/programs/queries"
import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { Pagination } from "@/components/pagination"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Program Offerings",
}

async function ProgramOfferingsPage({
  searchParams,
}: {
  searchParams: GetProgramsArgs
}) {
  const { programs, pageInfo } = await getPrograms(searchParams)

  return (
    <>
      <AppHeader pageTitle="Program Offerings" />
      <AppContent>
        <div className="flex items-center justify-between">
          <SearchField className="w-[300px]" />
          {!programs?.length ? (
            <Button asChild size="sm">
              <Link href="/setup-curriculum">
                <Settings /> Set up Curriculum
              </Link>
            </Button>
          ) : (
            <ProgramOfferingForm />
          )}
        </div>
        <ProgramOfferingsTable programOfferings={programs} />
        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default ProgramOfferingsPage
