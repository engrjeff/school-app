import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ProgramOfferingSelector } from "@/features/programs/progam-offering-selector"
import { getPrograms } from "@/features/programs/queries"
import { getSchoolYears } from "@/features/school-years/queries"
import { SchoolYearFormDialog } from "@/features/school-years/school-year-form"
import { SchoolYearsSelector } from "@/features/school-years/school-years-selector"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "School Years",
}

async function SchoolYearsPage({
  searchParams,
}: {
  searchParams: { program?: string }
}) {
  if (!searchParams.program) {
    // get the first program
    const programs = await getPrograms({ pageSize: 1 })

    if (!programs.programs.length) return redirect(`/program-offerings`)

    redirect(`/school-years?program=${programs.programs.at(0)?.id}`)
  }

  const schoolYears = await getSchoolYears(searchParams)

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <ProgramOfferingSelector />
            </BreadcrumbItem>
            {schoolYears.length === 0 ? null : (
              <>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <SchoolYearsSelector />
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <div className="flex items-center justify-between">
          <SearchField className="w-[300px]" />
          <SchoolYearFormDialog />
        </div>

        {schoolYears.length ? (
          <ul className="grid grid-cols-4 gap-6">
            {schoolYears?.map((sy) => (
              <li key={sy.id}>
                <Link
                  href={{
                    pathname: `/school-years/${sy.id}`,
                    query: {
                      program: searchParams.program,
                    },
                  }}
                >
                  <Card className="bg-accent/40 hover:border-primary">
                    <CardHeader>
                      <CardTitle>{sy.title}</CardTitle>
                      <CardDescription>
                        {sy.semesters.length} Semester
                        {sy.semesters.length > 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-center text-base">No school years yet.</p>
            <p className="text-muted-foreground mb-4 text-center">
              Create a school year now.
            </p>
            <SchoolYearFormDialog />
          </div>
        )}
      </AppContent>
    </>
  )
}

export default SchoolYearsPage
