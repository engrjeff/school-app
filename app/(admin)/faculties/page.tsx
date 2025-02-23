import { type Metadata } from "next"
import { FacultyFormDialog } from "@/features/faculties/faculty-form"
import { FacultyImportDialog } from "@/features/faculties/faculty-import-dialog"
import { FacultyTable } from "@/features/faculties/faculty-table"
import { getFaculties, GetFacultiesArgs } from "@/features/faculties/queries"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingTabs } from "@/components/program-offering-tabs"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Faculties",
}

async function FacultiesPage({
  searchParams,
}: {
  searchParams: GetFacultiesArgs
}) {
  const { faculties, pageInfo } = await getFaculties(searchParams)

  return (
    <>
      <>
        <AppHeader pageTitle="Faculties" />
        <AppContent>
          <div className="flex items-center justify-between gap-4">
            <SearchField className="w-[300px]" />
            <div className="ml-auto flex items-center space-x-3">
              <FacultyImportDialog currentFaculties={faculties} />
              <FacultyFormDialog />
            </div>
          </div>
          <ProgramOfferingTabs />
          <FacultyTable faculties={faculties} />
          {pageInfo && <Pagination pageInfo={pageInfo} />}
        </AppContent>
      </>
    </>
  )
}

export default FacultiesPage
