"use client"

import { Gender } from "@prisma/client"

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

  return (
    <TableBody className="text-xs" onKeyDown={handleGradeCellNavigation}>
      <StudentGradeRows
        gender={Gender.MALE}
        periodicGrades={male}
        gradeComponents={periodicGradesQuery.data?.gradeComponents ?? []}
        rowStart={0}
        refetchFunction={periodicGradesQuery.refetch}
      />
      <StudentGradeRows
        gender={Gender.FEMALE}
        periodicGrades={female}
        gradeComponents={periodicGradesQuery.data?.gradeComponents ?? []}
        rowStart={male.length}
        refetchFunction={periodicGradesQuery.refetch}
      />
    </TableBody>
  )
}
