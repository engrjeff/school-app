import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTeacherById } from "@/features/teachers/queries"
import { TeacherClassesTable } from "@/features/teachers/teacher-classes-table"
import { TeacherFacultiesTable } from "@/features/teachers/teacher-faculties-table"
import { Teacher } from "@prisma/client"
import {
  ArrowLeftIcon,
  MailIcon,
  MapPinnedIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  SlashIcon,
  UserIcon,
} from "lucide-react"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

interface PageProps {
  params: { id: string }
}

function getFullName(teacher: Teacher) {
  return [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
    teacher.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const teacher = await getTeacherById(params.id)

  return {
    title: `Teacher ${teacher?.teacherId}`,
  }
}

async function TeacherDetailPage({ params }: PageProps) {
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
            <BreadcrumbItem className="text-foreground font-semibold">
              {getFullName(teacher)} - #{teacher.teacherId}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent className="flex flex-row items-start px-0 pt-0">
        <div className="h-full max-w-sm space-y-6 border-r p-4">
          <div className="flex items-start gap-4 pb-4">
            <Button
              type="button"
              size="iconXs"
              variant="ghost"
              aria-label="go back"
              asChild
              className="hidden"
            >
              <Link href={`/students`}>
                <ArrowLeftIcon />
              </Link>
            </Button>
            <Avatar className="size-9 rounded-xl">
              <AvatarFallback className="bg-primary rounded-xl">
                {getInitials([teacher.firstName, teacher.lastName].join(" "))}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold tracking-tight">
                {getFullName(teacher)}
              </h1>
              <p className="text-muted-foreground text-xs uppercase">
                Employee ID:{" "}
                <span className="font-mono">{teacher.teacherId}</span>
              </p>
            </div>
            <Button
              asChild
              type="button"
              size="iconXXs"
              variant="secondaryOutline"
              aria-label="Edit details"
              className="ml-auto"
            >
              <Link href={`/teachers/${teacher.id}/edit`}>
                <PencilIcon />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Personal Info</h3>
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground  ">Gender: </span>{" "}
                <span className="capitalize">
                  {teacher.gender.toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinnedIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Address: </span>{" "}
                {teacher.address}
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Phone: </span>{" "}
                {teacher.phone}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MailIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Email: </span>{" "}
                {teacher.email}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6 p-4">
          {/* classes table */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold tracking-tight">Classes</h1>
              <p className="text-muted-foreground text-xs">List of classes</p>
            </div>
          </div>

          <TeacherClassesTable teacherClasses={teacher.classes} />

          <Separator />

          {/* faculties table */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold tracking-tight">Faculties</h1>
              <p className="text-muted-foreground text-xs">
                List of faculty memberships
              </p>
            </div>
            <Button type="button" size="sm" variant="link">
              <PlusIcon /> Add to Faculty
            </Button>
          </div>
          <TeacherFacultiesTable faculties={teacher.faculties} />
        </div>
      </AppContent>
    </>
  )
}

export default TeacherDetailPage
