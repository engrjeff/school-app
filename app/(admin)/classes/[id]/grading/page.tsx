import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSchoolClassById } from "@/features/school-class/queries"
import { SchoolClassGradingTable } from "@/features/school-class/school-class-grading-table"
import { ROLE } from "@prisma/client"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { RoleAccess } from "@/components/role-access"

interface PageProps {
  params: {
    id: string // class id
  }
  searchParams?: {
    period?: string
  }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const schoolClass = await getSchoolClassById(params.id)

  if (!schoolClass) return notFound()

  const pageTitle = [
    "Grading",
    `${schoolClass?.gradeYearLevel.displayName} ${schoolClass?.gradeYearLevel.level}`,
    schoolClass?.section.name,
  ].join("-")

  return {
    title: schoolClass ? pageTitle : "Class Not Found",
  }
}

async function SchoolClassGradingPage({ params, searchParams }: PageProps) {
  const schoolClass = await getSchoolClassById(params.id)

  if (!schoolClass) return notFound()

  const pageTitle = `${schoolClass?.gradeYearLevel.displayName} ${schoolClass?.gradeYearLevel.level}-${schoolClass?.section.name} ${schoolClass.subject.code}`

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link href={`/classes`} className="font-semibold">
                Classes
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
      <AppContent className="max-w-[calc(100vw-var(--sidebar-width)-30px)] overflow-x-hidden">
        <RoleAccess
          role={ROLE.TEACHER}
          loadingUi={<Skeleton className="h-9 w-[372px]" />}
        >
          <div className="flex justify-between">
            <Tabs defaultValue="grading">
              <TabsList>
                <TabsTrigger value="details" asChild>
                  <Link href={`/classes/${schoolClass.id}`}>Class Details</Link>
                </TabsTrigger>
                <TabsTrigger value="grading">
                  <Link href={`/classes/${schoolClass.id}/grading`}>
                    Grade Records
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="grade-summary">
                  <Link href={`/classes/${schoolClass.id}/grade-summary`}>
                    Grade Summary
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue={schoolClass.gradingPeriods.at(0)?.id}>
              <TabsList>
                {schoolClass.gradingPeriods.map((gp) => (
                  <TabsTrigger key={gp.id} value={gp.id} asChild>
                    <Link
                      href={{
                        pathname: `/classes/${schoolClass.id}/grading`,
                        query: { period: gp.id },
                      }}
                    >
                      {gp.title}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </RoleAccess>
        <SchoolClassGradingTable
          schoolClass={schoolClass}
          gradingPeriodId={searchParams?.period}
        />
      </AppContent>
    </>
  )
}

export default SchoolClassGradingPage
