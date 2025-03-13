import { type Metadata } from "next"
import Link from "next/link"
import { EnrollmentForm } from "@/features/enrollments/enrollment-form"
import { getEnrollmentById } from "@/features/enrollments/queries"
import { ArrowLeftIcon, SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Create Enrollment",
}

async function NewEnrollmentPage({
  searchParams,
}: {
  searchParams?: {
    duplicateId?: string
    course?: string
    program?: string
    schoolYear?: string
    semester?: string
    gradeYearLevel?: string
    section?: string
  }
}) {
  if (searchParams?.duplicateId) {
    const enrollment = await getEnrollmentById(searchParams.duplicateId)

    if (!enrollment)
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
          <p className="text-muted-foreground text-center">
            The enrollment class that you are trying to duplicate cannot be
            found. Either it does not exist or was already deleted.
          </p>
          <Button asChild size="sm">
            <Link href="/enrollments">
              <ArrowLeftIcon className="size-4" /> Back to Enrollment List
            </Link>
          </Button>
        </div>
      )

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
                New Enrollment
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>
        <AppContent>
          <EnrollmentForm initialValues={enrollment} />
        </AppContent>
      </>
    )
  }

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
              New Enrollment
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <EnrollmentForm
          initialValues={{
            programOfferingId: searchParams?.program,
            courseId: searchParams?.course,
            schoolYearId: searchParams?.schoolYear,
            semesterId: searchParams?.semester,
            sectionId: searchParams?.section,
            gradeYearLevelId: searchParams?.gradeYearLevel,
          }}
        />
      </AppContent>
    </>
  )
}

export default NewEnrollmentPage
