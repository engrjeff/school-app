import { type Metadata } from "next"
import { CoursesByProgram } from "@/features/dashboard/courses-by-program"
import { ProgramOfferingSelector } from "@/features/programs/progam-offering-selector"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SchoolYearFilter } from "@/components/school-year-filter"

export const metadata: Metadata = {
  title: "Dashboard",
}

function DashboardPage({
  searchParams,
}: {
  searchParams: { program?: string; schoolYear?: string }
}) {
  return (
    <>
      <AppHeader>
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem className="text-foreground font-semibold">
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <ProgramOfferingSelector hasInitial />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto space-x-2">
          <SchoolYearFilter initialProgramId={searchParams.program} />
        </div>
      </AppHeader>
      <AppContent className="grid grid-cols-1 items-start lg:grid-cols-3">
        <CoursesByProgram />
      </AppContent>
    </>
  )
}

export default DashboardPage
