import Link from "next/link"
import { notFound } from "next/navigation"
import { CourseTable } from "@/features/courses/course-table"
import { getProgramById } from "@/features/programs/queries"
import { PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SearchField } from "@/components/search-field"

async function ProgramOfferingCourses({ params }: { params: { id: string } }) {
  const { program } = await getProgramById(params.id)

  if (!program) return notFound()

  return (
    <>
      <AppHeader pageTitle={`Courses under ${program.title}`} />
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <SearchField className="w-[300px]" />
          <Button size="sm" className="h-9" asChild>
            <Link href={`/program-offerings/${program.id}/courses/new`}>
              <PlusCircleIcon className="size-4" />
              <span>Add Course</span>
            </Link>
          </Button>
        </div>
        <CourseTable program={program} />
      </AppContent>
    </>
  )
}

export default ProgramOfferingCourses
