import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSchoolClassById } from "@/features/school-class/queries"
import { SchoolClassTable } from "@/features/school-class/school-class-table"
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
  params: {
    id: string // class id
  }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const schoolClass = await getSchoolClassById(params.id)

  const pageTitle = [
    `${schoolClass?.gradeYearLevel.displayName} ${schoolClass?.gradeYearLevel.level}`,
    schoolClass?.section.name,
  ].join("-")

  return {
    title: pageTitle,
  }
}

async function SchoolClassPage({ params }: PageProps) {
  const schoolClass = await getSchoolClassById(params.id)

  if (!schoolClass) return notFound()

  const pageTitle = [
    `${schoolClass?.gradeYearLevel.displayName} ${schoolClass?.gradeYearLevel.level}`,
    schoolClass?.section.name,
  ].join("-")

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link
                href={`/school-years?program=${schoolClass.programOfferingId}`}
                className="font-semibold"
              >
                {schoolClass.programOffering.code}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link
                href={`/school-years/${schoolClass.schoolYearId}?program=${schoolClass.programOfferingId}`}
                className="font-semibold"
              >
                S.Y. {schoolClass.schoolYear.title}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link
                href={`/school-years/${schoolClass.schoolYearId}/semesters/${schoolClass.semesterId}`}
                className="font-semibold"
              >
                {schoolClass.semester.title}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground font-semibold">
              {pageTitle}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <SchoolClassTable schoolClass={schoolClass} />
      </AppContent>
    </>
  )
}

export default SchoolClassPage
