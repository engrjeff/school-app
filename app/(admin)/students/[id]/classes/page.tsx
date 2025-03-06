import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ClassActions } from "@/features/school-class/class-actions"
import { SchoolClassCard } from "@/features/school-class/school-class-card"
import {
  getClassesOfStudent,
  GetStudentClassesArgs,
} from "@/features/students/queries"
import { Student } from "@prisma/client"
import { InboxIcon } from "lucide-react"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { Pagination } from "@/components/pagination"
import { SchoolYearFilter } from "@/components/school-year-filter"

function getFullName(student: Student) {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
    student.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}

interface PageProps {
  params: { id: string } // student id
  searchParams: GetStudentClassesArgs
}

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> => {
  const { student } = await getClassesOfStudent(params.id, searchParams)

  return {
    title: student ? `Enrolled Classes of ${getFullName(student)}` : "Classes",
  }
}

async function StudentClassesPage({ params, searchParams }: PageProps) {
  const data = await getClassesOfStudent(params.id, searchParams)

  if (!data.student) return notFound()

  return (
    <>
      <AppHeader pageTitle="Classes" />
      <AppContent>
        <div className="flex items-center gap-4">
          {/* Filter by school year and semester */}
          <SchoolYearFilter
            initialProgramId={data.student.currentCourse.programOfferingId!}
          />
        </div>
        {data?.student?.classes?.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No classes found.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-4 gap-4">
            {data?.student.classes?.map((schoolClass) => (
              <li key={schoolClass.id} className="relative">
                <Link href={`/classes/${schoolClass.id}`}>
                  <SchoolClassCard schoolClass={schoolClass} />
                </Link>
                <ClassActions classId={schoolClass.id} />
              </li>
            ))}
          </ul>
        )}

        {data?.pageInfo && <Pagination pageInfo={data.pageInfo} />}
      </AppContent>
    </>
  )
}

export default StudentClassesPage
