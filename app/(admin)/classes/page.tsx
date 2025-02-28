import { type Metadata } from "next"
import Link from "next/link"
import { ClassesTable } from "@/features/school-class/classes-table"
import { getClasses, GetClassesArgs } from "@/features/school-class/queries"
import { SchoolClassCard } from "@/features/school-class/school-class-card"
import { InboxIcon } from "lucide-react"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { CourseFilter } from "@/components/course-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SchoolYearFilter } from "@/components/school-year-filter"
import { ViewToggle } from "@/components/view-toggle"

export const metadata: Metadata = {
  title: "Classes",
}

async function ClassesPage({ searchParams }: { searchParams: GetClassesArgs }) {
  const data = await getClasses(searchParams)

  return (
    <>
      <AppHeader pageTitle="Classes" />
      <AppContent>
        <div className="flex items-center gap-4">
          {/* Filter by program */}
          <ProgramOfferingFilter />
          {/* Filter by course */}
          <CourseFilter />
          {/* Filter by school year and semester */}
          <SchoolYearFilter />
          <div className="ml-auto">
            <ViewToggle />
          </div>
        </div>
        {data?.classes?.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No classes found.
            </p>
          </div>
        ) : (
          <>
            {searchParams.view === "grid" ? (
              <ul className="grid flex-1 grid-cols-4 gap-4">
                {data?.classes?.map((schoolClass) => (
                  <li key={schoolClass.id}>
                    <Link href={`/classes/${schoolClass.id}`}>
                      <SchoolClassCard schoolClass={schoolClass} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ClassesTable classes={data?.classes ?? []} />
            )}
          </>
        )}

        {data?.pageInfo && <Pagination pageInfo={data.pageInfo} />}
      </AppContent>
    </>
  )
}

export default ClassesPage
