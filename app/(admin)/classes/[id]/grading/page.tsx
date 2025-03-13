import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ClassSubjectGradingTable } from "@/features/enrollments/class-subject-grading-table"
import { getClassSubjectById } from "@/features/enrollments/queries"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

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
  searchParams,
}: PageProps): Promise<Metadata> => {
  const classSubject = await getClassSubjectById(
    params.id,
    searchParams?.period
  )

  if (!classSubject) return notFound()

  const e = classSubject.enrollmentClass

  const pageTitle = [
    "Grading",
    `${e?.gradeYearLevel.displayName} ${e?.gradeYearLevel.level}`,
    e?.section.name,
  ].join("-")

  return {
    title: pageTitle,
  }
}

async function SchoolClassGradingPage({ params, searchParams }: PageProps) {
  const classSubject = await getClassSubjectById(
    params.id,
    searchParams?.period
  )

  if (!classSubject) return notFound()

  const e = classSubject.enrollmentClass

  const pageTitle = `${e?.gradeYearLevel.displayName} ${e?.gradeYearLevel.level}-${e?.section.name} ${classSubject.subject.code}`

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
        <div className="flex justify-between">
          <Tabs defaultValue="grading">
            <TabsList>
              <TabsTrigger value="details" asChild>
                <Link href={`/classes/${classSubject.id}`}>Class Details</Link>
              </TabsTrigger>
              <TabsTrigger value="grading">
                <Link href={`/classes/${classSubject.id}/grading`}>
                  Grade Records
                </Link>
              </TabsTrigger>
              <TabsTrigger value="grade-summary">
                <Link href={`/classes/${classSubject.id}/grade-summary`}>
                  Grade Summary
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs
            defaultValue={searchParams?.period ?? e.gradingPeriods.at(0)?.id}
          >
            <TabsList>
              {e.gradingPeriods.map((gp) => (
                <TabsTrigger key={gp.id} value={gp.id} asChild>
                  <Link
                    href={{
                      pathname: `/classes/${classSubject.id}/grading`,
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
        <ClassSubjectGradingTable
          gradingPeriod={searchParams?.period}
          classSubject={classSubject}
        />
      </AppContent>
    </>
  )
}

export default SchoolClassGradingPage
