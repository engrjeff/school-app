import { type Metadata } from "next"
import { CourseForm } from "@/features/courses/course-form"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "New Course",
}

async function NewCoursePage({
  searchParams,
}: {
  searchParams: { program?: string }
}) {
  return (
    <>
      <AppHeader pageTitle={`New course`}></AppHeader>
      <AppContent>
        <CourseForm programOfferingId={searchParams.program} />
      </AppContent>
    </>
  )
}

export default NewCoursePage
