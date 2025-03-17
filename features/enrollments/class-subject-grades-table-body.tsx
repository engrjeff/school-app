"use client"

import {
  Gender,
  SubjectGrade,
  SubjectGradeComponent,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"

import { handleGradeCellNavigation } from "@/lib/dom-helpers"
import { usePeriodicGrades } from "@/hooks/use-periodic-grades"
import { Skeleton } from "@/components/ui/skeleton"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"

import { StudentGradeRows } from "./student-grade-rows"

export function ClassSubjectGradesTableBody({
  gradingPeriodId,
  totalColumns,
}: {
  gradingPeriodId: string
  totalColumns: number
}) {
  const periodicGradesQuery = usePeriodicGrades(gradingPeriodId)

  if (periodicGradesQuery.isLoading)
    return (
      <TableBody className="table-fixed">
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="h-10 border-r p-1 first:border-l last:border-r"
            colSpan={totalColumns}
          >
            <Skeleton className="size-full" />
          </TableCell>
        </TableRow>
        {Array.from(Array(20).keys()).map((n) => (
          <TableRow key={`skeleton-${n + 1}`}>
            <TableCell className="size-10 border-r p-1 first:border-l last:border-r">
              <Skeleton className="size-full" />
            </TableCell>
            <TableCell className="h-10 w-[160px] border-r p-1 first:border-l last:border-r">
              <Skeleton className="size-full" />
            </TableCell>
            <TableCell
              colSpan={totalColumns - 2}
              className="h-10 border-r p-1 first:border-l last:border-r"
            >
              <Skeleton className="size-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )

  const male =
    periodicGradesQuery.data?.periodicGrades?.filter(
      (d) => d.student.gender === Gender.MALE
    ) ?? []

  const female =
    periodicGradesQuery.data?.periodicGrades?.filter(
      (d) => d.student.gender === Gender.FEMALE
    ) ?? []

  const rankedGrade = getRowGradeAndRank(
    periodicGradesQuery.data?.periodicGrades ?? [],
    periodicGradesQuery.data?.gradeComponents ?? []
  )

  return (
    <TableBody className="text-xs" onKeyDown={handleGradeCellNavigation}>
      <StudentGradeRows
        gender={Gender.MALE}
        periodicGrades={male}
        gradeComponents={periodicGradesQuery.data?.gradeComponents ?? []}
        rowStart={0}
        refetchFunction={periodicGradesQuery.refetch}
        rankedGrade={rankedGrade}
      />
      <StudentGradeRows
        gender={Gender.FEMALE}
        periodicGrades={female}
        gradeComponents={periodicGradesQuery.data?.gradeComponents ?? []}
        rowStart={male.length}
        refetchFunction={periodicGradesQuery.refetch}
        rankedGrade={rankedGrade}
      />
    </TableBody>
  )
}

function getRowGradeAndRank(
  subjectGrades: Array<
    SubjectGrade & { scores: SubjectGradeSubComponentScore[] }
  >,
  gradeComponents: Array<
    SubjectGradeComponent & { subcomponents: SubjectGradeSubComponent[] }
  >
) {
  const gradeRankMap = new Map<string, { grade: number; rank: number }>()

  const studentWithGrades = subjectGrades.map((sg, index) => {
    return {
      ...getGrade(sg, gradeComponents),
      rank: index,
    }
  })

  studentWithGrades.sort((a, b) => b.grade - a.grade)

  // let currentRank = 1
  // for (let i = 0; i < studentWithGrades.length; i++) {
  //   if (
  //     i > 0 &&
  //     studentWithGrades[i].grade !== studentWithGrades[i - 1].grade
  //   ) {
  //     // If the current grade is different from the previous one, update the rank
  //     currentRank = i
  //   }
  //   studentWithGrades[i].rank = currentRank
  // }

  for (let i = 0; i < studentWithGrades.length; i++) {
    studentWithGrades[i].rank = i + 1
  }

  studentWithGrades.forEach((sgg) => {
    gradeRankMap.set(sgg.studentId, sgg)
  })

  return gradeRankMap
}

function getGrade(
  subjectGrade: SubjectGrade & { scores: SubjectGradeSubComponentScore[] },
  gradeComponents: Array<
    SubjectGradeComponent & { subcomponents: SubjectGradeSubComponent[] }
  >
) {
  const grade = gradeComponents.reduce((grade, gc) => {
    const maxTotal = gc.subcomponents.reduce(
      (sum, part) => (sum += part.highestPossibleScore),
      0
    )

    const scoreTotal = subjectGrade.scores
      .filter((s) => s.subjectGradeComponentId === gc.id && s.score !== null)
      .reduce((sum, score) => (sum += score.score!), 0)

    const ws = (scoreTotal / maxTotal) * gc.percentage * 100

    return grade + ws
  }, 0)

  return { studentId: subjectGrade.studentId, grade }
}
