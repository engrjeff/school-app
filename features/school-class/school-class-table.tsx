"use client"

import {
  Class,
  Gender,
  GradeYearLevel,
  SchoolYear,
  Section,
  Semester,
  Student,
  Subject,
  Teacher,
} from "@prisma/client"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"

interface Props {
  schoolClass: Class & {
    gradeYearLevel: GradeYearLevel
    section: Section
    subject: Subject
    semester: Semester
    schoolYear: SchoolYear
    teacher: Teacher
    students: Student[]
  }
}

export function SchoolClassTable({ schoolClass }: Props) {
  const maleStudents = schoolClass.students.filter(
    (s) => s.gender === Gender.MALE
  )

  const femaleStudents = schoolClass.students.filter(
    (s) => s.gender === Gender.FEMALE
  )

  return (
    <div>
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHeadPlain scope="col">
              <div className="flex items-center justify-between text-xs font-normal">
                <p className="text-muted-foreground uppercase">
                  S.Y. {schoolClass.schoolYear.title}
                </p>
                <p className="font-semibold uppercase">
                  {schoolClass.semester.title}
                </p>
              </div>
            </TableHeadPlain>
            <TableHeadPlain scope="col" colSpan={2}>
              <div className="flex items-center justify-between text-xs font-normal">
                <p className="text-muted-foreground uppercase">
                  Grade & Section:
                </p>
                <p className="font-semibold uppercase">
                  {schoolClass.gradeYearLevel.displayName}{" "}
                  {schoolClass.gradeYearLevel.level}-{schoolClass.section.name}
                </p>
              </div>
            </TableHeadPlain>
            <TableHeadPlain scope="col" colSpan={2}>
              <div className="flex items-center justify-between text-xs font-normal">
                <p className="text-muted-foreground uppercase">Teacher:</p>
                <p className="font-semibold uppercase">
                  {schoolClass.teacher.lastName},{" "}
                  {schoolClass.teacher.firstName}{" "}
                  {schoolClass.teacher.middleName} {schoolClass.teacher.suffix}
                </p>
              </div>
            </TableHeadPlain>
            <TableHeadPlain scope="col">
              <div className="flex items-center justify-between text-xs font-normal">
                <p className="text-muted-foreground uppercase">Subject:</p>
                <p className="font-semibold uppercase">
                  {!schoolClass.subject.code ||
                  schoolClass.subject.code === "--"
                    ? schoolClass.subject.title
                    : schoolClass.subject.code}
                </p>
              </div>
            </TableHeadPlain>
          </TableRow>
          <TableRow className="border-t-0">
            <TableHeadPlain className="whitespace-nowrap">
              Learner&apos;s Name
            </TableHeadPlain>
            <TableHeadPlain className="text-right">
              Student ID (LRN)
            </TableHeadPlain>
            <TableHeadPlain>Email</TableHeadPlain>
            <TableHeadPlain>Birthdate</TableHeadPlain>
            <TableHeadPlain>Status</TableHeadPlain>
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
    </div>
  )
}

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
          colSpan={6}
          className="bg-secondary/70 h-8 text-xs font-semibold uppercase"
        >
          {group}
        </TableHeadPlain>
      </TableRow>
      {students.map((student) => (
        <TableRow key={`row-${group.toLowerCase()}-${student.id}`}>
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
          <TableCell className="border-r-2 first:border-l last:border-r">
            <Badge className="capitalize">{student.status.toLowerCase()}</Badge>
          </TableCell>
          <TableCell className="border-r-2 first:border-l last:border-r"></TableCell>
        </TableRow>
      ))}
    </>
  )
}
