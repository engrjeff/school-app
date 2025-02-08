import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { getCourseById } from "@/features/courses/queries"
import { SubjectsTable } from "@/features/subjects/subjects-table"
import { CirclePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SearchField } from "@/components/search-field"

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const { course } = await getCourseById(params.id)

  return {
    title: `${course?.title} - Subjects`,
  }
}

async function CourseSubjectsPage({ params }: { params: { id: string } }) {
  const { course } = await getCourseById(params.id)

  if (!course) return notFound()

  return (
    <>
      <AppHeader pageTitle={`${course.title} > Subjects`} />
      <AppContent>
        <div className="flex items-center justify-between">
          <SearchField className="w-[300px]" />
          <Button size="sm">
            <CirclePlus /> Add Subject
          </Button>
        </div>
        <SubjectsTable subjects={course.subjects} />
      </AppContent>
    </>
  )
}

export default CourseSubjectsPage
