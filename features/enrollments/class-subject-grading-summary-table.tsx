import { getTeacherFullName } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"

import { DetailedClassSubject } from "./queries"

export function ClassSubjectGradingSummaryTable({
  classSubject,
}: {
  classSubject: DetailedClassSubject
}) {
  const { enrollmentClass, subject, teacher } = classSubject

  return (
    <>
      <div className="relative w-full max-w-full">
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
