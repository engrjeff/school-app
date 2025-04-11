import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EnrolledStudentsGrades } from "@/features/enrollments/enrolled-students-grades"
import { getEnrollmentById } from "@/features/enrollments/queries"
import { ArrowLeftIcon, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Student Grades",
}

interface PageProps {
  params: { id: string } // enrollment id
}

async function EnrollmentStudentGradesPage({ params }: PageProps) {
  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const schoolYear = `S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.programOffering.code}`

  const gradeSection = `${enrollment.course.code} ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                          ${enrollment.section.name}`

  return (
    <>
      <AppHeader pageTitle="Student Grades Report" />
      <AppContent>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            asChild
          >
            <Link href={`/enrollments/${params.id}`}>
              <ArrowLeftIcon />
            </Link>
          </Button>
          Back to Enrollment
        </div>
        <div className="bg-accent hidden w-max rounded border border-l-2 border-l-blue-500 px-4 py-3">
          <p className="text-sm">
            <InfoIcon
              className="-mt-0.5 me-3 inline-flex text-blue-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Showing progress reports in terms of grades for students of{" "}
            {gradeSection} during S.Y {schoolYear}{" "}
          </p>
        </div>
        <EnrolledStudentsGrades enrollmentId={params.id} />
      </AppContent>
    </>
  )
}

export default EnrollmentStudentGradesPage
