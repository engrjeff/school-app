import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EnrollmentStudentsForm } from "@/features/enrollments/enrollment-students-form"
import { getEnrollmentById } from "@/features/enrollments/queries"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Add Students",
}

async function AddStudentsToClassPage({ params }: { params: { id: string } }) {
  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const enrollmentLabel = `S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  const gradeSection = `${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList className="font-semibold">
            <BreadcrumbLink asChild>
              <Link href="/enrollments">Enrollments</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground">
              {enrollmentLabel} | Enroll Students
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <EnrollmentStudentsForm enrollment={enrollment} label={gradeSection} />
      </AppContent>
    </>
  )
}

export default AddStudentsToClassPage
