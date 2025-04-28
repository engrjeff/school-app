import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getStudentById } from "@/features/students/queries"
import { StudentClassesTable } from "@/features/students/student-classes-table"
import { Student } from "@prisma/client"
import { format } from "date-fns"
import {
  CalendarIcon,
  Grid3X3Icon,
  HomeIcon,
  ListOrderedIcon,
  MailIcon,
  MapPinnedIcon,
  PhoneIcon,
  SquareStackIcon,
  UserIcon,
} from "lucide-react"

import { site } from "@/config/site"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { ThemeToggler } from "@/components/theme-toggler"

export const metadata: Metadata = {
  title: "Student Portal",
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

async function StudentPage({ params }: { params: { studentId: string } }) {
  const { student } = await getStudentById(params.studentId)

  if (!student) {
    return notFound()
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex w-full items-center gap-2 px-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go home"
            asChild
          >
            <Link href={`/entry`}>
              <HomeIcon />
            </Link>
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-semibold">{site.title} Student Portal</h1>
          <div className="ml-auto">
            <ThemeToggler />
          </div>
        </div>
      </header>
      <main className="flex flex-1 justify-center px-4">
        <AppContent className="flex flex-row items-start px-0 pt-0">
          <div className="h-full space-y-6 border-r p-4">
            <div className="flex items-start gap-4 pb-2">
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

          <Tabs defaultValue="enrollments" className="flex-1 p-4">
            <TabsList className="grid w-max grid-cols-2">
              <TabsTrigger value="enrollments">My Enrollments</TabsTrigger>
              <TabsTrigger value="grades">My Grades</TabsTrigger>
            </TabsList>
            <TabsContent value="enrollments" className="flex-1 space-y-6 py-4">
              {/* classes table */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-semibold tracking-tight">Enrollments</h1>
                  <p className="text-muted-foreground text-xs">
                    List of classes
                  </p>
                </div>
              </div>
              <StudentClassesTable
                enrollmentClasses={student.enrollmentClasses}
              />
            </TabsContent>
            <TabsContent value="grades" className="flex-1 space-y-6 py-4">
              TO DO
            </TabsContent>
          </Tabs>
        </AppContent>
      </main>
    </div>
  )
}

export default StudentPage
