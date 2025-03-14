import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTeacherById } from "@/features/teachers/queries"
import { TeacherEditForm } from "@/features/teachers/teacher-edit-form"
import { SlashIcon } from "lucide-react"

import { getTeacherFullName } from "@/lib/utils"
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

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const teacher = await getTeacherById(params.id)

  return {
    title: `Edit Teacher ${teacher?.teacherId}`,
  }
}

async function TeacherEditPage({ params }: PageProps) {
  const teacher = await getTeacherById(params.id)

  if (!teacher) return notFound()

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbLink asChild>
              <Link className="font-semibold" href="/teachers">
                Teachers
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbLink asChild>
              <Link className="font-semibold" href={`/teachers/${teacher.id}`}>
                {getTeacherFullName(teacher)} - #{teacher.teacherId}
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
        <TeacherEditForm teacher={teacher} />
      </AppContent>
    </>
  )
}

export default TeacherEditPage
