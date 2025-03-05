import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSchoolClassById } from "@/features/school-class/queries"
import { SchoolClassTable } from "@/features/school-class/school-class-table"
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
    title: schoolClass ? pageTitle : "Class Not Found",
  }
}

async function SchoolClassPage({ params }: PageProps) {
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
      <AppContent>
        <RoleAccess
          role={ROLE.TEACHER}
          loadingUi={<Skeleton className="h-9 w-[372px]" />}
        >
          <Tabs defaultValue="details">
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
        </RoleAccess>
        <SchoolClassTable schoolClass={schoolClass} />
      </AppContent>
    </>
  )
}

export default SchoolClassPage
