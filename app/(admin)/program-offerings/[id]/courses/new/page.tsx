import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseForm } from "@/features/courses/course-form"
import { getProgramById } from "@/features/programs/queries"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "New Course",
}

/**
 *
 * @param params.id - the program offering id
 * @returns
 */
async function NewCoursePage({ params }: { params: { id: string } }) {
  const { program } = await getProgramById(params.id)

  if (!program) return notFound()

  return (
    <>
      <AppHeader pageTitle={`New course for ${program.title}`}></AppHeader>
      <AppContent>
        <CourseForm programId={program.id} />
      </AppContent>
    </>
  )
}

export default NewCoursePage
