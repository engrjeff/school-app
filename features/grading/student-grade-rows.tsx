"use client"

import { Fragment } from "react"
import {
  Gender,
  GradeComponent,
  GradeComponentPart,
  GradeComponentPartScore,
  GradingPeriod,
  StudentGrade,
} from "@prisma/client"
import { Loader2Icon } from "lucide-react"

import { useStudentGrades } from "@/hooks/use-student-grades"
import { TableCell, TableHeadPlain, TableRow } from "@/components/ui/table"

import { GradeCellForm } from "./grade-cell-form"

interface StudentGradeRowsProps {
  gender: Gender
  gradingPeriod: GradingPeriod & {
    gradeComponents: Array<GradeComponent & { parts: GradeComponentPart[] }>
  }
}

export function StudentGradeRows({
  gender,
  gradingPeriod,
}: StudentGradeRowsProps) {
  const studentGrades = useStudentGrades(gender, gradingPeriod.id)

  const rowStart =
    gender === Gender.FEMALE ? (studentGrades.data?.length ?? 0) : 0

  const totalColumns =
    gradingPeriod.gradeComponents.reduce(
      (t, i) => (t += i.parts.length + 2),
      0
    ) + 4

  if (studentGrades.isLoading)
    return (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={totalColumns}>
          <div className="flex h-[50vh] w-full flex-col items-center justify-center">
            <Loader2Icon className="size-5 animate-spin" />
            <p className="text-sm">Loading grades...</p>
          </div>
        </TableCell>
      </TableRow>
    )

  const rankedGrade = getRowGradeAndRank(
    studentGrades.data ?? [],
    gradingPeriod.gradeComponents
  )

  return (
    <>
      <TableRow className="hover:bg-transparent">
        <TableHeadPlain
          colSpan={totalColumns}
          className="bg-secondary/70 h-8 text-xs font-semibold uppercase"
        >
          {gender}
        </TableHeadPlain>
      </TableRow>
      {studentGrades.data?.map((sg, sgIndex) => (
        <TableRow
          key={`row-student-grade-${sg.id}`}
          className="hover:bg-transparent"
        >
          <TableCell className="w-10 whitespace-nowrap border-r text-center first:border-l last:border-r">
            {sgIndex + 1}
          </TableCell>
          <TableCell className="whitespace-nowrap border-r first:border-l last:border-r">
            <p>
              {sg.student.lastName}, {sg.student.firstName}{" "}
              {sg.student.middleName} {sg.student.suffix}
            </p>
          </TableCell>
          {gradingPeriod.gradeComponents.map((gc, gcIndex) => (
            <Fragment key={`student-${gc.id}`}>
              {gc.parts.map((p, pIndex) => (
                <TableCell
                  key={`student-${gc.id}-${p.id}`}
                  className="!size-10 max-w-[40px] whitespace-nowrap border-r !p-0 text-center text-xs first:border-l last:border-r"
                >
                  <GradeCellForm
                    key={getCellScore(sg.scores, sg.id, gc.id, p.id)?.id}
                    row={sgIndex + rowStart}
                    column={
                      pIndex +
                      getColumnsToAdd(gradingPeriod.gradeComponents, gcIndex)
                    }
                    studentGrade={sg}
                    gradeComponentPart={p}
                    cellScore={getCellScore(sg.scores, sg.id, gc.id, p.id)}
                    refetch={studentGrades.refetch}
                  />
                </TableCell>
              ))}
              <TableCell className="text-primary size-9 whitespace-nowrap border-r p-1 text-center text-xs font-semibold first:border-l last:border-r">
                {getPartScoresTotal(sg, gc.id)}
              </TableCell>
              {/* <TableCell
                className="size-9 whitespace-nowrap border-r p-1 text-center text-xs first:border-l last:border-r"
                title="Highest Possible Total Score"
              ></TableCell> */}
              <TableCell
                className="text-primary size-9 whitespace-nowrap border-r p-1 text-center text-xs font-semibold first:border-l last:border-r"
                title="Weighted Grade"
              >
                {getWeightedPartScoresTotal(sg, gc)}
              </TableCell>
            </Fragment>
          ))}
          <TableCell
            className="size-9 border-r p-1 text-center text-xs font-semibold text-emerald-500 first:border-l last:border-r"
            title="Grade"
          >
            {rankedGrade.get(sg.studentId)?.grade
              ? rankedGrade.get(sg.studentId)?.grade.toFixed(1)
              : ""}
          </TableCell>
          <TableCell
            className="size-9 border-r p-1 text-center text-xs font-semibold text-emerald-500 first:border-l last:border-r"
            title="Rank"
          >
            {rankedGrade.get(sg.studentId)?.grade
              ? rankedGrade.get(sg.studentId)?.rank
              : ""}
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function getCellScore(
  rowScores: GradeComponentPartScore[],
  studentGradeId: string,
  gradeComponentId: string,
  gradePartId: string
) {
  return rowScores.find(
    (s) =>
      s.studentGradeId === studentGradeId &&
      s.parentGradeComponentId === gradeComponentId &&
      s.gradeComponentPartId === gradePartId
  )
}

function getPartScoresTotal(
  studentGrade: StudentGrade & { scores: GradeComponentPartScore[] },
  gradeComponentId: string
) {
  const total = studentGrade.scores
    .filter((s) => s.parentGradeComponentId === gradeComponentId)
    .reduce((sum, score) => (sum += score.score), 0)

  return total === 0 ? "" : total.toFixed(1)
}

function getWeightedPartScoresTotal(
  studentGrade: StudentGrade & { scores: GradeComponentPartScore[] },
  gradeComponent: GradeComponent & { parts: GradeComponentPart[] }
) {
  const maxTotal = gradeComponent.parts.reduce(
    (sum, part) => (sum += part.highestPossibleScore),
    0
  )
  const scoreTotal = studentGrade.scores
    .filter((s) => s.parentGradeComponentId === gradeComponent.id)
    .reduce((sum, score) => (sum += score.score), 0)

  const ws = (scoreTotal / maxTotal) * gradeComponent.percentage * 100

  return ws === 0 ? "" : ws.toFixed(1)
}

function getColumnsToAdd(
  gradeComponents: Array<GradeComponent & { parts: GradeComponentPart[] }>,
  currentIndex: number
) {
  return gradeComponents.reduce(
    (sum, item, index) =>
      currentIndex > index ? sum + item.parts.length : sum,
    1
  )
}

// function getRowGrade(
//   studentGrade: StudentGrade & { scores: GradeComponentPartScore[] },
//   gradeComponents: Array<GradeComponent & { parts: GradeComponentPart[] }>
// ) {
//   const grade = gradeComponents.reduce((grade, gc) => {
//     const maxTotal = gc.parts.reduce(
//       (sum, part) => (sum += part.highestPossibleScore),
//       0
//     )

//     const scoreTotal = studentGrade.scores
//       .filter((s) => s.parentGradeComponentId === gc.id)
//       .reduce((sum, score) => (sum += score.score), 0)

//     const ws = (scoreTotal / maxTotal) * gc.percentage * 100

//     return grade + ws
//   }, 0)

//   return grade === 0 ? "" : grade.toFixed(1)
// }

function getRowGradeAndRank(
  studentGrades: Array<StudentGrade & { scores: GradeComponentPartScore[] }>,
  gradeComponents: Array<GradeComponent & { parts: GradeComponentPart[] }>
) {
  const gradeRankMap = new Map<string, { grade: number; rank: number }>()

  const studentWithGrades = studentGrades.map((sg, index) => {
    return {
      ...getGrade(sg),
      rank: index,
    }
  })

  studentWithGrades.sort((a, b) => b.grade - a.grade)

  let currentRank = 1
  for (let i = 0; i < studentWithGrades.length; i++) {
    if (
      i > 0 &&
      studentWithGrades[i].grade !== studentWithGrades[i - 1].grade
    ) {
      // If the current grade is different from the previous one, update the rank
      currentRank = i
    }
    studentWithGrades[i].rank = currentRank
  }

  studentWithGrades.forEach((sgg) => {
    gradeRankMap.set(sgg.studentId, sgg)
  })

  function getGrade(
    studentGrade: StudentGrade & { scores: GradeComponentPartScore[] }
  ) {
    const grade = gradeComponents.reduce((grade, gc) => {
      const maxTotal = gc.parts.reduce(
        (sum, part) => (sum += part.highestPossibleScore),
        0
      )

      const scoreTotal = studentGrade.scores
        .filter((s) => s.parentGradeComponentId === gc.id)
        .reduce((sum, score) => (sum += score.score), 0)

      const ws = (scoreTotal / maxTotal) * gc.percentage * 100

      return grade + ws
    }, 0)

    return { studentId: studentGrade.studentId, grade }
  }

  return gradeRankMap
}
