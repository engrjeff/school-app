import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EnrollmentRowActions } from "@/features/enrollments/enrollment-row-actions"
import { getEnrollmentById } from "@/features/enrollments/queries"
import { ROLE } from "@prisma/client"
import { ArrowLeftIcon, PencilIcon, PlusIcon, SlashIcon } from "lucide-react"

import { getTeacherFullName } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { RoleAccess } from "@/components/role-access"

interface PageProps {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const enrollmentLabel = `S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  return {
    title: enrollmentLabel,
  }
}

async function EnrollmentDetailPage({ params }: PageProps) {
  const enrollment = await getEnrollmentById(params.id)

  if (!enrollment) return notFound()

  const enrollmentLabel = `S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.course.code} | ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  const schoolYear = `S.Y. ${enrollment.schoolYear.title} ${enrollment.semester.title} | ${enrollment.programOffering.code}`

  const gradeSection = `${enrollment.course.code} ${enrollment.gradeYearLevel.displayName} ${enrollment.gradeYearLevel.level} -
                      ${enrollment.section.name}`

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList className="font-semibold">
            <BreadcrumbLink asChild>
              <Link href="/enrollments">Enrollments</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground">
              {enrollmentLabel}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent className="container max-w-screen-lg">
        <div className="flex items-start gap-4 pb-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back to list"
            asChild
          >
            <Link href={`/enrollments`}>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold tracking-tight">{gradeSection}</h1>
            <p className="text-muted-foreground text-xs">{schoolYear}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <RoleAccess role={ROLE.SCHOOLADMIN}>
              <Button
                asChild
                type="button"
                size="iconXXs"
                variant="secondaryOutline"
                aria-label="Edit enrollment details"
              >
                <Link href={`/enrollments/${enrollment.id}/edit`}>
                  <PencilIcon />
                </Link>
              </Button>
              <EnrollmentRowActions enrollmentId={enrollment.id} forDetail />
            </RoleAccess>
          </div>
        </div>

        {/* list of subjects */}
        <div className="max-w-full space-y-3 overflow-auto">
          <div>
            <h1 className="font-semibold tracking-tight">Class Subjects</h1>
            <p className="text-muted-foreground text-xs">
              List of subjects in this class.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="bg-accent/40">Subject Code</TableHead>
                <TableHead className="bg-accent/40">Subject Title</TableHead>
                <TableHead className="bg-accent/40">Teacher</TableHead>
                <TableHead className="bg-accent/40 text-center">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollment.subjects.map((classSubject) => (
                <TableRow
                  key={classSubject.id}
                  className="hover:bg-transparent"
                >
                  <TableCell>
                    {["", undefined, "--"].includes(classSubject.subject.code)
                      ? "No subject code"
                      : classSubject.subject.code}
                  </TableCell>
                  <TableCell>{classSubject.subject.title}</TableCell>
                  <TableCell>
                    <Link
                      href={`/teachers/${classSubject.teacherId}`}
                      className="hover:underline"
                    >
                      {getTeacherFullName(classSubject.teacher)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" variant="link" asChild>
                      <Link href={`/classes/${classSubject.id}`}>
                        View Class
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* list of students */}
        <div className="max-w-full space-y-3 overflow-auto">
          <div className="flex items-center">
            <div>
              <h1 className="font-semibold tracking-tight">
                Enrolled Students
              </h1>
              <p className="text-muted-foreground text-xs">
                List of students enrolled in this class.
              </p>
            </div>
            <RoleAccess role={ROLE.SCHOOLADMIN}>
              <div className="ml-auto">
                <Button asChild size="sm" variant="link">
                  <Link href={`/enrollments/${enrollment.id}/enroll-students`}>
                    <PlusIcon className="size-4" /> Enroll Students
                  </Link>
                </Button>
              </div>
            </RoleAccess>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="bg-accent/40 w-10">#</TableHead>
                <TableHead className="bg-accent/40">Name</TableHead>
                <TableHead className="bg-accent/40 text-center">
                  Student Number (LRN)
                </TableHead>
                <TableHead className="bg-accent/40">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollment.students.length ? (
                enrollment.students.map((student, studentIndex) => (
                  <TableRow key={student.id} className="hover:bg-transparent">
                    <TableCell>{studentIndex + 1}</TableCell>
                    <TableCell>
                      <div>
                        <Link
                          href={`/students/${student.id}`}
                          className="hover:underline"
                          prefetch
                        >
                          <p>
                            {student.lastName}, {student.firstName}{" "}
                            {student.middleName} {student.suffix}
                          </p>
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {student.studentId}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} height={300}>
                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 text-center">
                      <p>No enrolled students listed yet.</p>
                      <Button asChild size="sm">
                        <Link
                          href={`/enrollments/${enrollment.id}/enroll-students`}
                        >
                          <PlusIcon className="size-4" /> Enroll Students
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </AppContent>
    </>
  )
}

export default EnrollmentDetailPage
