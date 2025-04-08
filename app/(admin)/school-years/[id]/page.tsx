import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProgramOfferingSelector } from "@/features/programs/progam-offering-selector"
import { getSchoolYearById } from "@/features/school-years/queries"
import { SchoolYearsSelector } from "@/features/school-years/school-years-selector"
import { CalendarPlusIcon, SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "School Years",
}

async function SchoolYearItemPage({ params }: { params: { id: string } }) {
  const schoolYear = await getSchoolYearById(params.id)

  if (!schoolYear) return notFound()

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <ProgramOfferingSelector />
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <SchoolYearsSelector />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold">
            Showing semesters under {schoolYear.programOffering.code} during
            S.Y. {schoolYear.title}
          </p>
          <Button size="sm" className="hidden">
            <CalendarPlusIcon /> Add Semester
          </Button>
        </div>
        <ul className="grid grid-cols-4 gap-6">
          {schoolYear.semesters.map((semester) => (
            <li key={semester.id}>
              <Link
                href={`/classes?program=${schoolYear.programOfferingId}&schoolYear=${schoolYear.id}&semester=${semester.id}`}
              >
                <Card className="bg-accent/40 hover:border-primary">
                  <CardHeader>
                    <CardTitle>{semester.title}</CardTitle>
                    <CardDescription>S.Y. {schoolYear.title}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </AppContent>
    </>
  )
}

export default SchoolYearItemPage
