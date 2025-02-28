import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStudentById } from "@/features/students/queries"
import { StudentEditForm } from "@/features/students/student-edit-form"
import { Student } from "@prisma/client"
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

interface PageProps {
  params: { id: string }
}

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

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { student } = await getStudentById(params.id)

  return {
    title: `Edit Student ${student?.studentId}`,
  }
}

async function StudentEditPage({ params }: PageProps) {
  const { student } = await getStudentById(params.id)

  if (!student) return notFound()

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link className="font-semibold" href="/students">
                Students
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link className="font-semibold" href={`/students/${student.id}`}>
                {getFullName(student)} - #{student.studentId}
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground font-semibold">
              Edit
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <StudentEditForm student={student} />
      </AppContent>
    </>
  )
}

export default StudentEditPage
