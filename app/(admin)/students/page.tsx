import { type Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/auth"
import {
  getStudentsOfCurrentSchool,
  getStudentsOfTeacher,
  type GetStudentsArgs,
} from "@/features/students/queries"
import { StudentImportDialog } from "@/features/students/student-import-dialog"
import { StudentsTable } from "@/features/students/students-table"
import { ROLE } from "@prisma/client"
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
  const session = await getSession()

  const { students, pageInfo } =
    session?.user.role === ROLE.TEACHER
      ? await getStudentsOfTeacher(searchParams)
      : await getStudentsOfCurrentSchool(searchParams)

  return (
    <>
      <AppHeader pageTitle="Students" />
      <AppContent>
        <div className="flex items-center gap-4">
          <SearchField
            className="w-[300px]"
            placeholder="Search for name, LRN"
          />
          {/* Filter by program */}
          <ProgramOfferingFilter />
          {/* Filter by course */}
          <CourseFilter key={searchParams.program} />
          {session?.user.role === ROLE.SCHOOLADMIN ? (
            <div className="ml-auto flex items-center space-x-3">
              <StudentImportDialog currentStudents={students} />
              <Button asChild size="sm">
                <Link href="/students/new">
                  <PlusIcon className="size-4" /> Add Student
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        <StudentsTable students={students} />
        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default StudentsPage
