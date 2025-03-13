import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStudentById } from "@/features/students/queries"
import { StudentClassesTable } from "@/features/students/student-classes-table"
import { ROLE, Student } from "@prisma/client"
import { format } from "date-fns"
import {
  ArrowLeftIcon,
  CalendarIcon,
  Grid3X3Icon,
  ListOrderedIcon,
  MailIcon,
  MapPinnedIcon,
  PencilIcon,
  PhoneIcon,
  SlashIcon,
  SquareStackIcon,
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
import { Skeleton } from "@/components/ui/skeleton"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { RoleAccess } from "@/components/role-access"

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
    title: `Student ${student?.studentId}`,
  }
}

async function StudentDetalPage({ params }: PageProps) {
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
            <BreadcrumbItem className="text-foreground font-semibold">
              {student.studentId} - {getFullName(student)}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent className="flex flex-row items-start px-0 pt-0">
        <div className="h-full space-y-6 border-r p-4">
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
                {getInitials([student.firstName, student.lastName].join(" "))}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold tracking-tight">
                {getFullName(student)}
              </h1>
              <p className="text-muted-foreground text-xs uppercase">
                Student ID/LRN:{" "}
                <span className="font-mono">{student.studentId}</span>
              </p>
            </div>
            <RoleAccess
              role={ROLE.SCHOOLADMIN}
              loadingUi={<Skeleton className="size-7" />}
            >
              <Button
                asChild
                type="button"
                size="iconXXs"
                variant="secondaryOutline"
                aria-label="Edit details"
              >
                <Link href={`/students/${student.id}/edit`}>
                  <PencilIcon />
                </Link>
              </Button>
            </RoleAccess>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Personal Info</h3>
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground  ">Gender: </span>{" "}
                <span className="capitalize">
                  {student.gender.toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Birthdate: </span>{" "}
                {student.birthdate
                  ? format(new Date(student.birthdate), "MMM dd, yyyy")
                  : "--"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinnedIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Address: </span>{" "}
                {student.address}
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
                {student.phone}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MailIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Email: </span>{" "}
                {student.email}
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Student Info</h3>
            <div className="flex items-center gap-2 text-sm">
              <SquareStackIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Course: </span>{" "}
                {student.currentCourse?.code}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ListOrderedIcon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Grade/Year Level:{" "}
                </span>{" "}
                {student.currentGradeYearLevel?.displayName}{" "}
                {student.currentGradeYearLevel?.level}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Grid3X3Icon className="text-muted-foreground size-3" />
              <p className="text-sm">
                <span className="text-muted-foreground">Section: </span>{" "}
                {student.currentSection
                  ? student.currentSection.name
                  : "Not Yet Enrolled"}
              </p>
            </div>
          </div>
        </div>
        {/* classes table */}
        <div className="flex-1 space-y-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold tracking-tight">Enrollments</h1>
              <p className="text-muted-foreground text-xs">List of classes</p>
            </div>
          </div>
          <StudentClassesTable enrollmentClasses={student.enrollmentClasses} />
        </div>
      </AppContent>
    </>
  )
}

export default StudentDetalPage
