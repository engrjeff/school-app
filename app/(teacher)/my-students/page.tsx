import { type Metadata } from "next"
import {
  getStudentsOfTeacher,
  type GetStudentsArgs,
} from "@/features/students/queries"
import { StudentsTable } from "@/features/students/students-table"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { CourseFilter } from "@/components/course-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "My Students",
}

async function MyStudentsPage({
  searchParams,
}: {
  searchParams: GetStudentsArgs
}) {
  const { students, pageInfo } = await getStudentsOfTeacher(searchParams)

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
        </div>

        <StudentsTable students={students} />
        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default MyStudentsPage
