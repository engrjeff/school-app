"use client"

import { Fragment, useMemo } from "react"
import {
  Class,
  Gender,
  GradeComponent,
  GradeComponentPart,
  GradeYearLevel,
  GradingPeriod,
  SchoolYear,
  Section,
  Semester,
  Student,
  Subject,
  Teacher,
} from "@prisma/client"

import { handleGradeCellNavigation } from "@/lib/dom-helpers"
import {
  Table,
  TableBody,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"

import { StudentGradeRows } from "../grading/student-grade-rows"

interface Props {
  gradingPeriodId?: string
  schoolClass: Class & {
    gradeYearLevel: GradeYearLevel
    section: Section
    subject: Subject
    semester: Semester
    schoolYear: SchoolYear
    teacher: Teacher
    students: Student[]
    gradingPeriods: Array<
      GradingPeriod & {
        gradeComponents: Array<GradeComponent & { parts: GradeComponentPart[] }>
      }
    >
  }
}

export function SchoolClassGradingTable({
  schoolClass,
  gradingPeriodId,
}: Props) {
  const currentGradingPeriod = useMemo(
    () =>
      gradingPeriodId
        ? (schoolClass.gradingPeriods.find((g) => g.id === gradingPeriodId) ??
          schoolClass.gradingPeriods[0])
        : schoolClass.gradingPeriods[0],
    [schoolClass.gradingPeriods, gradingPeriodId]
  )

  return (
    <div className="relative overflow-hidden">
      {schoolClass.gradingPeriods.every(
        (gp) => gp.gradeComponents.length === 0
      ) ? (
        <div className="bg-background/70 absolute inset-0 z-10 flex size-full flex-col items-center space-y-2 py-20 backdrop-blur-sm">
          <p className="text-lg font-semibold">No grading components found.</p>
          <p className="text-muted-foreground">
            It looks like you have not defined the grading components for this
            class yet. Define them first.
          </p>
        </div>
      ) : null}
      <div className="w-full max-w-full">
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
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">
                    Grade & Section:
                  </p>
                  <p className="font-semibold uppercase">
                    {schoolClass.gradeYearLevel.displayName}{" "}
                    {schoolClass.gradeYearLevel.level}-
                    {schoolClass.section.name}
                  </p>
                </div>
              </TableHeadPlain>
              <TableHeadPlain scope="col">
                <div className="flex items-center justify-between text-xs font-normal">
                  <p className="text-muted-foreground uppercase">Teacher:</p>
                  <p className="font-semibold uppercase">
                    {schoolClass.teacher.lastName},{" "}
                    {schoolClass.teacher.firstName}{" "}
                    {schoolClass.teacher.middleName}{" "}
                    {schoolClass.teacher.suffix}
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
          </TableHeader>
        </Table>
      </div>
      <Table className="table-auto">
        <TableHeader>
          <TableRow className="border-t-0">
            <TableHeadPlain>#</TableHeadPlain>
            <TableHeadPlain className="whitespace-nowrap">
              Learner&apos;s Name
            </TableHeadPlain>
            {currentGradingPeriod.gradeComponents.map((gc) => (
              <TableHeadPlain
                key={gc.id}
                colSpan={gc.parts.length + 2}
                className="whitespace-nowrap"
              >
                {gc.title} ({gc.percentage * 100}%)
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
            {currentGradingPeriod.gradeComponents.map((gc) => (
              <Fragment key={`sub-${gc.id}`}>
                {gc.parts.map((p) => (
                  <TableHeadPlain
                    key={`${gc.id}-${p.id}`}
                    className="size-10 whitespace-nowrap p-0 text-center text-xs"
                  >
                    {p.title}
                  </TableHeadPlain>
                ))}
                <TableHeadPlain className="text-primary p-0 text-center text-xs font-semibold">
                  Total
                </TableHeadPlain>
                {/* <TableHeadPlain
                  className="size-9 p-1 text-center text-xs"
                  title="Percentage Score"
                >
                  PS
                </TableHeadPlain> */}
                <TableHeadPlain
                  className="text-primary p-1 text-center text-xs font-semibold"
                  title="Weighted Score"
                >
                  WS
                </TableHeadPlain>
              </Fragment>
            ))}
            {/* <TableHeadPlain
              className="h-9 p-1 text-center text-xs"
              title="Grade"
            ></TableHeadPlain>
            <TableHeadPlain
              className="h-9 p-1 text-center text-xs"
              title="Rank"
            ></TableHeadPlain> */}
          </TableRow>
          {/* Highest possible scores */}
          <TableRow>
            <TableHeadPlain
              colSpan={2}
              className="h-9 whitespace-nowrap p-1 text-right text-xs"
            >
              Highest Possible Score
            </TableHeadPlain>
            {currentGradingPeriod.gradeComponents.map((gc) => (
              <Fragment key={`hps-${gc.id}`}>
                {gc.parts.map((p) => (
                  <TableHeadPlain
                    key={`${gc.id}-${p.id}`}
                    className="!size-10 whitespace-nowrap p-1 text-center text-xs"
                  >
                    {p.highestPossibleScore}
                  </TableHeadPlain>
                ))}
                <TableHeadPlain className="text-primary size-10 p-1 text-center text-xs font-semibold">
                  {gc.parts.reduce(
                    (sum, i) => (sum += i.highestPossibleScore),
                    0
                  )}
                </TableHeadPlain>
                {/* <TableHeadPlain
                  className="size-9 p-1 text-center text-xs"
                  title="Highest Possible Total Score"
                >
                  100
                </TableHeadPlain> */}
                <TableHeadPlain
                  className="text-primary size-10 p-1 text-center text-xs font-semibold"
                  title="Percentage"
                >
                  {gc.percentage * 100}%
                </TableHeadPlain>
              </Fragment>
            ))}
            {/* <TableHeadPlain
              className="size-10 p-1 text-center text-xs"
              title="Grade"
            ></TableHeadPlain>
            <TableHeadPlain
              className="size-10 p-1 text-center text-xs"
              title="Rank"
            ></TableHeadPlain> */}
          </TableRow>
        </TableHeader>

        <TableBody className="text-xs" onKeyDown={handleGradeCellNavigation}>
          <StudentGradeRows
            gender={Gender.MALE}
            gradingPeriod={currentGradingPeriod}
          />
          <StudentGradeRows
            gender={Gender.FEMALE}
            gradingPeriod={currentGradingPeriod}
          />
        </TableBody>
      </Table>
    </div>
  )
}
