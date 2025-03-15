import { type Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getSession } from "@/auth"
import { EnrollmentEditForm } from "@/features/enrollments/enrollment-edit-form"
import { getEnrollmentById } from "@/features/enrollments/queries"
import { ROLE } from "@prisma/client"
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

interface PageProps {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const enrollmentLabel = `Edit | S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  return {
    title: enrollmentLabel,
  }
}

async function EditEnrollmentPage({ params }: PageProps) {
  const session = await getSession()

  if (session?.user?.role !== ROLE.SCHOOLADMIN) redirect("/enrollments")

  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const enrollmentLabel = `Edit | S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.course.code} | ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  const schoolYear = `Under S.Y. ${enrollment.schoolYear.title}, ${enrollment.semester.title}, ${enrollment.programOffering.code}`

  const gradeSection = `Edit ${enrollment.course.code} ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
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
              {enrollmentLabel}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <EnrollmentEditForm title={gradeSection} subtitle={schoolYear} />
      </AppContent>
    </>
  )
}

export default EditEnrollmentPage
