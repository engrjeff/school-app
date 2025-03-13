import { GradeComponentPicker } from "@/features/grading/grade-component-picker"
import { ROLE } from "@prisma/client"

import { getTeacherFullName } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"
import { RoleAccess } from "@/components/role-access"

import { DetailedClassSubject } from "./queries"

export function ClassSubjectGradingSummaryTable({
  classSubject,
}: {
  classSubject: DetailedClassSubject
}) {
  const { enrollmentClass, subject, teacher, periodicGrades } = classSubject

  return (
    <>
      <div className="relative w-full max-w-full">
        {periodicGrades.length === 0 ? (
          <div className="bg-background/70 absolute inset-0 z-10 flex size-full flex-col items-center space-y-2 py-20 backdrop-blur-sm">
            <p className="text-lg font-semibold">
              No grading components found.
            </p>
            <p className="text-muted-foreground">
              It looks like you have not set up the grading components for this
              class yet. Set them up first.
            </p>
            <RoleAccess role={ROLE.TEACHER}>
              <GradeComponentPicker />
            </RoleAccess>
          </div>
        ) : null}
        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between whitespace-nowrap text-xs font-normal">
                  <p className="text-muted-foreground uppercase">
                    S.Y. {enrollmentClass.schoolYear.title}
                  </p>
                  <p className="font-semibold uppercase">
                    {enrollmentClass.semester.title}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between whitespace-nowrap text-xs font-normal">
                  <p className="text-muted-foreground uppercase">
                    Grade & Section:
                  </p>
                  <p className="font-semibold uppercase">
                    {enrollmentClass.gradeYearLevel.displayName}{" "}
                    {enrollmentClass.gradeYearLevel.level}-
                    {enrollmentClass.section.name}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between whitespace-nowrap text-xs font-normal">
                  <p className="text-muted-foreground uppercase">Teacher:</p>
                  <p className="font-semibold uppercase">
                    {getTeacherFullName(teacher)}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between whitespace-nowrap text-xs font-normal">
                  <p className="text-muted-foreground uppercase">Subject:</p>
                  <p className="font-semibold uppercase">
                    {!subject.code || subject.code === "--"
                      ? subject.title
                      : subject.code}
                  </p>
                </div>
              </TableHeadPlain>
            </TableRow>
          </TableHeader>
        </Table>
        <Table className="table-auto">
          <TableHeader>
            <TableRow className="border-t-0">
              <TableHeadPlain className="w-10">#</TableHeadPlain>
              <TableHeadPlain className="whitespace-nowrap">
                Learner&apos;s Name
              </TableHeadPlain>
              <TableHeadPlain className="whitespace-nowrap">
                Student Number (LRN)
              </TableHeadPlain>
              {enrollmentClass.gradingPeriods.map((period) => (
                <TableHeadPlain
                  key={period.id}
                  className="whitespace-nowrap text-center"
                >
                  {period.title}
                </TableHeadPlain>
              ))}
              <TableHeadPlain className="whitespace-nowrap text-center">
                Ave. Grade
              </TableHeadPlain>
              <TableHeadPlain className="whitespace-nowrap text-center">
                Remark{" "}
                <span className="text-muted-foreground text-xs">
                  (subject-wise)
                </span>
              </TableHeadPlain>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>
    </>
  )
}
