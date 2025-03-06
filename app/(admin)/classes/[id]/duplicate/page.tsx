import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DuplicateSchoolClassForm } from "@/features/school-class/duplicate-class-form"
import { getSchoolClassById } from "@/features/school-class/queries"
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

export const metadata: Metadata = {
  title: "Duplicate Class",
}

async function DuplicateClassPage({ params }: { params: { id: string } }) {
  const schoolClass = await getSchoolClassById(params.id)

  if (!schoolClass) return notFound()

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
              Duplicate Class
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <DuplicateSchoolClassForm schoolClass={schoolClass} />
      </AppContent>
    </>
  )
}

export default DuplicateClassPage
