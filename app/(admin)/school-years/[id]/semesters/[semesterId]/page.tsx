import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SchoolClassCard } from "@/features/school-class/school-class-card"
import { getSemesterById } from "@/features/school-years/queries"
import { PlusIcon, SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

interface PageParams {
  params: {
    id: string // school year id
    semesterId: string // semester id
  }
}

export const generateMetadata = async ({
  params,
}: PageParams): Promise<Metadata> => {
  const semester = await getSemesterById(params.semesterId)

  return {
    title: `${semester?.schoolYear?.title} - ${semester?.title}`,
  }
}

async function SemestersPage({ params }: PageParams) {
  const semester = await getSemesterById(params.semesterId)

  if (!semester) return notFound()

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link
                href={`/school-years?program=${semester.schoolYear.programOfferingId}`}
                className="font-semibold"
              >
                {semester.schoolYear.programOffering.code}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link
                href={`/school-years/${semester.schoolYearId}?program=${semester.schoolYear.programOfferingId}`}
                className="font-semibold"
              >
                S.Y. {semester.schoolYear.title}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground font-semibold">
              {semester.title} Classes
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        {semester.classes.length ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">
                Showing classes under {semester.schoolYear.programOffering.code}{" "}
                during S.Y. {semester.schoolYear.title}
              </p>
              <Button size="sm" asChild>
                <Link
                  href={`/school-years/${semester.schoolYearId}/classes/new`}
                >
                  <PlusIcon /> Add Class
                </Link>
              </Button>
            </div>
            <ul className="grid grid-cols-3 gap-6">
              {semester.classes.map((c) => (
                <li key={c.id}>
                  <Link href={`/classes/${c.id}`}>
                    <SchoolClassCard schoolClass={c} />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-center text-base">
              No classes for S.Y. {semester.schoolYear.title} {semester.title}{" "}
              yet.
            </p>
            <p className="text-muted-foreground mb-4 text-center">
              Add a class now.
            </p>
            <Button size="sm" asChild>
              <Link href={`/school-years/${semester.schoolYearId}/classes/new`}>
                <PlusIcon /> Add Class
              </Link>
            </Button>
          </div>
        )}
      </AppContent>
    </>
  )
}

export default SemestersPage
