import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { GradeComponentPicker } from "@/features/grading/grade-component-picker"
import { StudentGradeSummaryTable } from "@/features/grading/student-grade-summary-table"
import { getSchoolClassById } from "@/features/school-class/queries"
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
import {
  Table,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { RoleAccess } from "@/components/role-access"

interface PageProps {
  params: {
    id: string // class id
  }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const schoolClass = await getSchoolClassById(params.id)

  if (!schoolClass) return notFound()

  const pageTitle = [
    "Grade Summary",
    `${schoolClass?.gradeYearLevel.displayName} ${schoolClass?.gradeYearLevel.level}`,
    schoolClass?.section.name,
  ].join("-")

  return {
    title: schoolClass ? pageTitle : "Class Not Found",
  }
}

async function SchoolClassGradeSummaryPage({ params }: PageProps) {
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
            <Tabs defaultValue="grade-summary">
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
          </div>
        </RoleAccess>

        <div className="relative">
          {schoolClass.gradingPeriods.every(
            (gp) => gp.gradeComponents.length === 0
          ) ? (
            <div className="bg-background/70 absolute inset-0 z-10 flex flex-col items-center space-y-2 py-20 backdrop-blur-sm">
              <p className="text-lg font-semibold">
                No grading components found.
              </p>
              <p className="text-muted-foreground">
                It looks like you have not defined the grading components for
                this class yet. Define them first.
              </p>
              <RoleAccess role={ROLE.TEACHER}>
                <GradeComponentPicker />
              </RoleAccess>
            </div>
          ) : null}
          <div className="relative overflow-hidden">
            <div className="w-full max-w-full">
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHeadPlain scope="col">
                      <div className="flex items-center justify-between text-xs font-normal">
                        <p className="text-muted-foreground uppercase">
                          S.Y. {schoolClass.schoolYear.title}
                        </p>
                        <p className="font-semibold uppercase">
                          {schoolClass.semester.title}
                        </p>
                      </div>
                    </TableHeadPlain>
                    <TableHeadPlain scope="col">
                      <div className="flex items-center justify-between text-xs font-normal">
                        <p className="text-muted-foreground uppercase">
                          Grade & Section:
                        </p>
                        <p className="font-semibold uppercase">
                          {schoolClass.gradeYearLevel.displayName}{" "}
                          {schoolClass.gradeYearLevel.level}-
                          {schoolClass.section.name}
                        </p>
                      </div>
                    </TableHeadPlain>
                    <TableHeadPlain scope="col">
                      <div className="flex items-center justify-between text-xs font-normal">
                        <p className="text-muted-foreground uppercase">
                          Teacher:
                        </p>
                        <p className="font-semibold uppercase">
                          {schoolClass.teacher.lastName},{" "}
                          {schoolClass.teacher.firstName}{" "}
                          {schoolClass.teacher.middleName}{" "}
                          {schoolClass.teacher.suffix}
                        </p>
                      </div>
                    </TableHeadPlain>
                    <TableHeadPlain scope="col">
                      <div className="flex items-center justify-between text-xs font-normal">
                        <p className="text-muted-foreground uppercase">
                          Subject:
                        </p>
                        <p className="font-semibold uppercase">
                          {!schoolClass.subject.code ||
                          schoolClass.subject.code === "--"
                            ? schoolClass.subject.title
                            : schoolClass.subject.code}
                        </p>
                      </div>
                    </TableHeadPlain>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <StudentGradeSummaryTable />
          </div>
        </div>
      </AppContent>
    </>
  )
}

export default SchoolClassGradeSummaryPage
