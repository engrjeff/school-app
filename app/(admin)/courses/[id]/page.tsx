import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CourseDetail } from "@/features/courses/course-detail"
import { getCourseById } from "@/features/courses/queries"
import { ArrowLeft, Table2Icon, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const { course } = await getCourseById(params.id)

  return {
    title: course?.title,
  }
}

async function CourseDetailPage({ params }: { params: { id: string } }) {
  const { course } = await getCourseById(params.id)

  if (!course) return notFound()

  return (
    <>
      <AppHeader pageTitle={course.title} />
      <AppContent>
        <div className="flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            asChild
          >
            <Link href={`/courses`}>
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{course.code}</h2>
            <p className="text-muted-foreground text-sm">
              Showing details for {course.title}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button type="button" size="sm" variant="secondaryOutline" asChild>
              <Link href={`/students?course=${course.id}`}>
                <UserCheck />
                Enrolled Students
              </Link>
            </Button>
            <Button type="button" size="sm" variant="secondaryOutline" asChild>
              <Link
                href={`/classes?program=${course.programOfferingId}&course=${course.id}`}
              >
                <Table2Icon />
                Classes
              </Link>
            </Button>
          </div>
        </div>
        <CourseDetail course={course} />
      </AppContent>
    </>
  )
}

export default CourseDetailPage
