import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getClassSubjectById } from "@/features/enrollments/queries"
import { Gender, Student } from "@prisma/client"
import { format } from "date-fns"
import { SlashIcon } from "lucide-react"

import { getTeacherFullName } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

interface PageProps {
  params: {
    id: string // class id
  }
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const classSubject = await getClassSubjectById(params.id)

  if (!classSubject) return notFound()

  const e = classSubject.enrollmentClass

  const pageTitle = [
    `${e?.gradeYearLevel.displayName} ${e?.gradeYearLevel.level}`,
    e?.section.name,
  ].join("-")

  return {
    title: pageTitle,
  }
}

async function SchoolClassPage({ params }: PageProps) {
  const classSubject = await getClassSubjectById(params.id)

  if (!classSubject) return notFound()

  const e = classSubject.enrollmentClass

  const pageTitle = `${e?.gradeYearLevel.displayName} ${e?.gradeYearLevel.level}-${e?.section.name} ${classSubject.subject.code}`

  const maleStudents = e.students.filter((s) => s.gender === Gender.MALE)

  const femaleStudents = e.students.filter((s) => s.gender === Gender.FEMALE)

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
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details" asChild>
              <Link href={`/classes/${classSubject.id}`}>Class Details</Link>
            </TabsTrigger>
            <TabsTrigger value="grading">
              <Link href={`/classes/${classSubject.id}/grading`}>
                Grade Records
              </Link>
            </TabsTrigger>
            <TabsTrigger value="grade-summary">
              <Link href={`/classes/${classSubject.id}/grade-summary`}>
                Grade Summary
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHeadPlain scope="col" colSpan={2}>
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">
                    S.Y. {e.schoolYear.title}
                  </p>
                  <p className="font-semibold uppercase">{e.semester.title}</p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col" colSpan={2}>
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">
                    Grade & Section:
                  </p>
                  <p className="font-semibold uppercase">
                    {e.gradeYearLevel.displayName} {e.gradeYearLevel.level}-
                    {e.section.name}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col" colSpan={2}>
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">Teacher:</p>
                  <p className="font-semibold uppercase">
                    {getTeacherFullName(classSubject.teacher)}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">Subject:</p>
                  <p className="font-semibold uppercase">
                    {!classSubject.subject.code ||
                    classSubject.subject.code === "--"
                      ? classSubject.subject.title
                      : classSubject.subject.code}
                  </p>
                </div>
              </TableHeadPlain>
            </TableRow>
            <TableRow className="border-t-0">
              <TableHeadPlain className="w-10 whitespace-nowrap text-center">
                #
              </TableHeadPlain>
              <TableHeadPlain className="whitespace-nowrap">
                Learner&apos;s Name
              </TableHeadPlain>
              <TableHeadPlain className="text-right">
                Student ID (LRN)
              </TableHeadPlain>
              <TableHeadPlain>Email</TableHeadPlain>
              <TableHeadPlain>Birthdate</TableHeadPlain>
              <TableHeadPlain className="text-center">Status</TableHeadPlain>
              <TableHeadPlain>
                <span className="sr-only">Actions</span>
              </TableHeadPlain>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs [&_td]:p-2">
            <StudentRows group="Male" students={maleStudents} />
            <StudentRows group="Female" students={femaleStudents} />
          </TableBody>
        </Table>
      </AppContent>
    </>
  )
}

export default SchoolClassPage

function StudentRows({
  group,
  students,
}: {
  group: string
  students: Student[]
}) {
  return (
    <>
      <TableRow className="hover:bg-transparent">
        <TableHeadPlain
          colSpan={7}
          className="bg-secondary/70 h-8 text-xs font-semibold uppercase"
        >
          {group}
        </TableHeadPlain>
      </TableRow>
      {students.map((student, studentIndex) => (
        <TableRow key={`row-${group.toLowerCase()}-${student.id}`}>
          <TableCell className="size-10 whitespace-nowrap border-r-2 text-center first:border-l last:border-r">
            {studentIndex + 1}
          </TableCell>
          <TableCell className="whitespace-nowrap border-r-2 first:border-l last:border-r">
            <p>
              {student.lastName}, {student.firstName} {student.middleName}{" "}
              {student.suffix}
            </p>
          </TableCell>
          <TableCell className="border-r-2 text-right first:border-l last:border-r">
            {student.studentId}
          </TableCell>
          <TableCell className="text-muted-foreground border-r-2 first:border-l last:border-r">
            {student.email}
          </TableCell>
          <TableCell className="border-r-2 first:border-l last:border-r">
            {student.birthdate
              ? format(new Date(student.birthdate), "MMM dd, yyyy")
              : "--"}
          </TableCell>
          <TableCell className="border-r-2 text-center first:border-l last:border-r">
            <Badge variant={student.status}>
              {student.status.toLowerCase()}
            </Badge>
          </TableCell>
          <TableCell className="border-r-2 text-center first:border-l last:border-r">
            <Button size="sm" variant="link" asChild>
              <Link href={`/students/${student.id}`}>View</Link>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
