import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SchoolClassForm } from "@/features/school-class/school-class-form"
import { getSchoolYearById } from "@/features/school-years/queries"
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
  title: "New Class",
}

async function NewClassPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { program: string; semester: string }
}) {
  const schoolYear = await getSchoolYearById(params.id)

  if (!schoolYear) return notFound()

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link
                className="font-semibold"
                href={{
                  pathname: `/school-years`,
                  query: { program: schoolYear.programOfferingId },
                }}
              >
                {schoolYear.programOffering.code}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link
                className="font-semibold"
                href={{
                  pathname: `/school-years/${params.id}`,
                  query: { program: schoolYear.programOfferingId },
                }}
              >
                S.Y. {schoolYear.title}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground font-semibold">
              New Class
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <SchoolClassForm
          schoolYear={schoolYear}
          semesterId={searchParams.semester}
        />
      </AppContent>
    </>
  )
}

export default NewClassPage
