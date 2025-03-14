import { Fragment } from "react"
import { GradeComponentPicker } from "@/features/grading/grade-component-picker"
import { GradeSubComponentFormDialog } from "@/features/grading/grade-subcomponent-form"
import { ROLE } from "@prisma/client"

import { getTeacherFullName } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"
import { RoleAccess } from "@/components/role-access"

import { GradeSubcomponentMenu } from "../grading/grade-subcomponent-menu"
import { ClassSubjectGradesTableBody } from "./class-subject-grades-table-body"
import { DetailedClassSubject } from "./queries"

export function ClassSubjectGradingTable({
  classSubject,
  gradingPeriod,
}: {
  classSubject: DetailedClassSubject
  gradingPeriod?: string
}) {
  const { enrollmentClass, subject, teacher, periodicGrades } = classSubject

  const currentPeriodicGrades = periodicGrades.at(0)

  const currentGradingPeriodId = gradingPeriod
    ? gradingPeriod
    : enrollmentClass.gradingPeriods.at(0)?.id

  const totalColumns =
    periodicGrades[0]?.gradeComponents.reduce(
      (t, i) => (t += i.subcomponents?.length + 2),
      0
    ) + 4

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
              <GradeComponentPicker gradingPeriodId={currentGradingPeriodId!} />
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
              <TableHeadPlain>#</TableHeadPlain>
              <TableHeadPlain className="whitespace-nowrap">
                Learner&apos;s Name
              </TableHeadPlain>
              {currentPeriodicGrades?.gradeComponents.map((gc) => (
                <TableHeadPlain
                  key={gc.id}
                  colSpan={gc.subcomponents.length + 2}
                  className="whitespace-nowrap pr-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      {gc.title} ({gc.percentage * 100}%)
                    </span>
                    {currentGradingPeriodId ? (
                      <RoleAccess role={ROLE.TEACHER}>
                        <GradeSubComponentFormDialog
                          classSubjectId={classSubject.id}
                          parentGradeComponent={gc}
                          order={gc.subcomponents.length + 1}
                          gradingPeriodId={currentGradingPeriodId}
                        />
                      </RoleAccess>
                    ) : null}
                  </div>
                </TableHeadPlain>
              ))}
              <TableHeadPlain rowSpan={3} className="whitespace-nowrap">
                Grade
              </TableHeadPlain>
              <TableHeadPlain rowSpan={3} className="whitespace-nowrap">
                Rank
              </TableHeadPlain>
            </TableRow>
            {/* subcomponents */}
            <TableRow>
              <TableHeadPlain
                colSpan={2}
                className="size-10 p-0"
              ></TableHeadPlain>
              {currentPeriodicGrades?.gradeComponents.map((gc) => (
                <Fragment key={`sub-${gc.id}`}>
                  {gc.subcomponents.map((p) => (
                    <TableHeadPlain
                      key={`${gc.id}-${p.id}`}
                      className="size-10 whitespace-nowrap p-1 text-center text-xs"
                    >
                      <GradeSubcomponentMenu gradeSubcomponent={p} />
                    </TableHeadPlain>
                  ))}
                  <TableHeadPlain className="text-primary p-1 text-center text-xs font-semibold">
                    Total
                  </TableHeadPlain>
                  <TableHeadPlain
                    className="text-primary p-1 text-center text-xs font-semibold"
                    title="Weighted Score"
                  >
                    WS
                  </TableHeadPlain>
                </Fragment>
              ))}
            </TableRow>
            {/* Highest possible scores */}
            <TableRow>
              <TableHeadPlain
                colSpan={2}
                className="h-9 whitespace-nowrap p-1 text-right text-xs"
              >
                Highest Possible Score
              </TableHeadPlain>
              {currentPeriodicGrades?.gradeComponents.map((gc) => (
                <Fragment key={`hps-${gc.id}`}>
                  {gc.subcomponents.map((p) => (
                    <TableHeadPlain
                      key={`${gc.id}-${p.id}`}
                      className="!size-10 whitespace-nowrap p-1 text-center text-xs"
                    >
                      {p.highestPossibleScore}
                    </TableHeadPlain>
                  ))}
                  <TableHeadPlain className="text-primary size-10 p-1 text-center text-xs font-semibold">
                    {gc.subcomponents.reduce(
                      (sum, i) => (sum += i.highestPossibleScore),
                      0
                    )}
                  </TableHeadPlain>
                  <TableHeadPlain
                    className="text-primary size-10 p-1 text-center text-xs font-semibold"
                    title="Percentage"
                  >
                    {gc.percentage * 100}%
                  </TableHeadPlain>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          {currentPeriodicGrades && (
            <ClassSubjectGradesTableBody
              gradingPeriodId={currentGradingPeriodId!}
              totalColumns={totalColumns}
            />
          )}
        </Table>
      </div>
    </>
  )
}
