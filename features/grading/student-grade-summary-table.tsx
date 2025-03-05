"use client"

import { Loader2Icon } from "lucide-react"

import { useGradeSummary } from "@/hooks/use-grade-summary"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeadPlain,
  TableRow,
} from "@/components/ui/table"

import { k12Ranking } from "./ranking"

export function StudentGradeSummaryTable() {
  const gradeSummary = useGradeSummary()

  if (gradeSummary.isLoading)
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <Loader2Icon className="size-5 animate-spin" />
        <p className="text-sm">Loading grades...</p>
      </div>
    )

  const d = gradeSummary.data

  return (
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
          {gradeSummary.data?.heading.map((period) => (
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
      <TableBody>
        {d?.cells.map((cell, studentIndex) => (
          <TableRow>
            <TableCell className="w-10 whitespace-nowrap border-r text-center first:border-l last:border-r">
              {studentIndex + 1}
            </TableCell>
            <TableCell className="whitespace-nowrap border-r first:border-l last:border-r">
              <p>
                {cell.student.lastName}, {cell.student.firstName}{" "}
                {cell.student.middleName} {cell.student.suffix}
              </p>
            </TableCell>
            <TableCell className="whitespace-nowrap border-r first:border-l last:border-r">
              {cell.student.studentId}
            </TableCell>
            {d.heading.map((h) => (
              <TableCell
                key={`row-${studentIndex}-cell-${h.id}`}
                className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r"
              >
                {cell[h.title].grade ? (
                  cell[h.title].grade.toFixed(1)
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
            ))}
            <TableCell className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r">
              {getAverageGrade(
                d.heading.map((h) => cell[h.title].grade).filter(Boolean)
              )}
            </TableCell>
            {["ELEM", "JHS", "SHS"].includes(d.program) ? (
              <TableCell className="whitespace-nowrap border-r text-center first:border-l last:border-r">
                {getRemark(
                  d.heading.map((h) => cell[h.title].grade).filter(Boolean)
                )}
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function getAverageGrade(grades: number[]) {
  const sum = grades.reduce((sum, grade) => (sum += grade), 0)

  const ave = sum / grades.length

  return !ave ? (
    <span className="text-muted-foreground">N/A</span>
  ) : (
    ave.toFixed(1)
  )
}

function getRemark(grades: number[]) {
  const sum = grades.reduce((sum, grade) => (sum += grade), 0)

  const ave = Math.floor(sum / grades.length)

  return k12Ranking.find((r) => ave >= r.min && ave <= r.max)?.remark
}
