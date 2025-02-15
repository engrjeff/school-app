import { type Metadata } from "next"
import { CourseBasicTable } from "@/features/courses/course-basic-table"
import {
  GetCoursesArgs,
  getCoursesOfCurrentSchool,
} from "@/features/courses/queries"
import { CirclePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Courses",
}

async function CoursesPage({ searchParams }: { searchParams: GetCoursesArgs }) {
  const { courses } = await getCoursesOfCurrentSchool(searchParams)

  return (
    <>
      <AppHeader pageTitle="Courses" />
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <SearchField className="w-[300px]" />

          {/* Filter by program */}
          <ProgramOfferingFilter />

          <div className="ml-auto space-x-3">
            <Button size="sm">
              <CirclePlus /> Add Course
            </Button>
          </div>
        </div>

        <CourseBasicTable courses={courses} />
      </AppContent>
    </>
  )
}

export default CoursesPage
