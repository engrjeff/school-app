"use client"

import { Fragment } from "react"
import {
  Gender,
  ROLE,
  SubjectGrade,
  SubjectGradeComponent,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"

import {
  PeriodicGrade,
  PeriodicGradeComponents,
} from "@/hooks/use-periodic-grades"
import { TableCell, TableRow } from "@/components/ui/table"
import { RoleAccess } from "@/components/role-access"

import { GradeCellForm } from "./grade-cell-form"

export function StudentGradeRows({
  gender,
  periodicGrades,
  rowStart,
  refetchFunction,
  gradeComponents,
  rankedGrade,
}: {
  gender: Gender
  periodicGrades: PeriodicGrade[]
  rowStart: number
  refetchFunction: VoidFunction
  gradeComponents: PeriodicGradeComponents[]
  rankedGrade: Map<
    string,
    {
      grade: number
      rank: number
    }
  >
}) {
  const totalColumns =
    gradeComponents.reduce((t, i) => (t += i.subcomponents?.length + 2), 0) + 4

  return (
    <>
      <TableRow className="hover:bg-transparent">
        <TableCell
          colSpan={totalColumns}
          className="bg-accent/30 h-8 border-x py-0 text-xs font-semibold uppercase"
        >
          {gender}
        </TableCell>
      </TableRow>
      {periodicGrades.map((gradeRow, gradeRowIndex) => (
        <TableRow
          key={`row-student-grade-${gradeRow.id}`}
          className="hover:bg-transparent"
        >
          <TableCell className="w-10 whitespace-nowrap border-r text-center first:border-l last:border-r">
            {gradeRowIndex + 1}
          </TableCell>
          <TableCell className="w-[160px] whitespace-nowrap  border-r first:border-l last:border-r">
            <p>
              {gradeRow.student.lastName}, {gradeRow.student.firstName}{" "}
              {gradeRow.student.middleName} {gradeRow.student.suffix}
            </p>
          </TableCell>
          {gradeComponents.map((gc, gcIndex) => (
            <Fragment key={`student-${gc.id}`}>
              {gc.subcomponents.map((p, pIndex) => (
                <TableCell
                  key={`student-${gc.id}-${p.id}`}
                  className="!size-10 max-w-[40px] whitespace-nowrap border-r !p-0 text-center text-xs first:border-l last:border-r"
                >
                  <RoleAccess
                    role={ROLE.TEACHER}
                    fallback={
                      <span>
                        {
                          getCellScore(
                            gradeRow.scores,
                            gradeRow.id,
                            gc.id,
                            p.id
                          )?.score
                        }
                      </span>
                    }
                  >
                    <GradeCellForm
                      row={gradeRowIndex + rowStart}
                      column={
                        pIndex + getColumnsToAdd(gradeComponents, gcIndex)
                      }
                      subjectGrade={gradeRow}
                      gradeSubComponent={p}
                      cellScore={getCellScore(
                        gradeRow.scores,
                        gradeRow.id,
                        gc.id,
                        p.id
                      )}
                      refetch={refetchFunction}
                    />
                  </RoleAccess>
                </TableCell>
              ))}
              <TableCell className="text-primary bg-accent/30 size-10 whitespace-nowrap border-r p-1 text-center text-xs font-semibold first:border-l last:border-r">
                {getPartScoresTotal(gradeRow, gc.id)}
              </TableCell>
              <TableCell
                className="text-primary bg-accent/30 size-10 whitespace-nowrap border-r p-1 text-center text-xs font-semibold first:border-l last:border-r"
                title="Weighted Grade"
              >
                {getWeightedPartScoresTotal(gradeRow, gc)}
              </TableCell>
            </Fragment>
          ))}
          <TableCell
            className="size-9 border-r p-1 text-center text-xs font-semibold text-emerald-500 first:border-l last:border-r"
            title="Grade"
          >
            {rankedGrade.get(gradeRow.studentId)?.grade === 0
              ? ""
              : rankedGrade.get(gradeRow.studentId)?.grade.toFixed(1)}
          </TableCell>
          <TableCell
            className="size-9 border-r p-1 text-center text-xs font-semibold text-emerald-500 first:border-l last:border-r"
            title="Rank"
          >
            {rankedGrade.get(gradeRow.studentId)?.grade === 0
              ? ""
              : rankedGrade.get(gradeRow.studentId)?.rank}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function getCellScore(
  rowScores: SubjectGradeSubComponentScore[],
  subjectGradeId: string,
  subjectGradeComponentId: string,
  subjectGradeSubComponentId: string
) {
  return rowScores.find(
    (s) =>
      s.subjectGradeId === subjectGradeId &&
      s.subjectGradeComponentId === subjectGradeComponentId &&
      s.subjectGradeSubComponentId === subjectGradeSubComponentId
  )!
}

function getPartScoresTotal(
  subjectGrade: SubjectGrade & { scores: SubjectGradeSubComponentScore[] },
  gradeComponentId: string
) {
  const total = subjectGrade.scores
    .filter(
      (s) => s.subjectGradeComponentId === gradeComponentId && s.score !== null
    )
    .reduce((sum, score) => (sum += score.score!), 0)

  return total === 0 ? "" : total.toFixed(1)
}

function getWeightedPartScoresTotal(
  subjectGrade: SubjectGrade & { scores: SubjectGradeSubComponentScore[] },
  gradeComponent: SubjectGradeComponent & {
    subcomponents: SubjectGradeSubComponent[]
  }
) {
  const maxTotal = gradeComponent.subcomponents.reduce(
    (sum, part) => (sum += part.highestPossibleScore),
    0
  )
  const scoreTotal = subjectGrade.scores
    .filter(
      (s) => s.subjectGradeComponentId === gradeComponent.id && s.score !== null
    )
    .reduce((sum, score) => (sum += score.score!), 0)

  const ws = (scoreTotal / maxTotal) * gradeComponent.percentage * 100

  return ws === 0 ? "" : ws.toFixed(1)
}

function getColumnsToAdd(
  gradeComponents: Array<
    SubjectGradeComponent & { subcomponents: SubjectGradeSubComponent[] }
  >,
  currentIndex: number
) {
  return gradeComponents.reduce(
    (sum, item, index) =>
      currentIndex > index ? sum + item.subcomponents.length : sum,
    1
  )
}
