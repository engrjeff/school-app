import { type Metadata } from "next"
import Link from "next/link"
import { getTeachers, GetTeachersArgs } from "@/features/teachers/queries"
import { TeacherImportDialog } from "@/features/teachers/teacher-import-dialog"
import { TeachersTable } from "@/features/teachers/teachers-table"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { FacultyFilter } from "@/components/faculty-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Teachers",
}

async function TeachersPage({
  searchParams,
}: {
  searchParams: GetTeachersArgs
}) {
  const { teachers, pageInfo } = await getTeachers(searchParams)

  return (
    <>
      <AppHeader pageTitle="Teachers" />
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <SearchField className="w-[300px]" />
          {/* Filter by program */}
          <ProgramOfferingFilter />
          {/* Filter by faculty */}
          <FacultyFilter />
          <div className="ml-auto flex items-center space-x-3">
            <TeacherImportDialog currentTeachers={teachers} />
            <Button asChild size="sm">
              <Link href="/teachers/new">
                <PlusIcon className="size-4" /> Add Teacher
              </Link>
            </Button>
          </div>
        </div>
        <TeachersTable teachers={teachers} />
        {pageInfo ? <Pagination pageInfo={pageInfo} /> : null}
      </AppContent>
    </>
  )
}

export default TeachersPage
