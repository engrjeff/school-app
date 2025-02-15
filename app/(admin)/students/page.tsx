import { type Metadata } from "next"
import Link from "next/link"
import { StudentImportDialog } from "@/features/school/student-import-dialog"
import {
  getStudentsOfCurrentSchool,
  type GetStudentsArgs,
} from "@/features/students/queries"
import { StudentsTable } from "@/features/students/students-table"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { CourseFilter } from "@/components/course-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Students",
}

async function StudentsPage({
  searchParams,
}: {
  searchParams: GetStudentsArgs
}) {
  const { students, pageInfo } = await getStudentsOfCurrentSchool(searchParams)

  return (
    <>
      <AppHeader pageTitle="Students" />
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <SearchField
            className="w-[300px]"
            placeholder="Search for name, LRN"
          />
          {/* Filter by program */}
          <ProgramOfferingFilter />
          {/* Filter by course */}
          <CourseFilter />
          <div className="ml-auto flex items-center space-x-3">
            <StudentImportDialog />
            <Button asChild size="sm">
              <Link href="#">
                <PlusIcon className="size-4" /> Add Student
              </Link>
            </Button>
          </div>
        </div>

        <StudentsTable students={students} />
        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default StudentsPage
