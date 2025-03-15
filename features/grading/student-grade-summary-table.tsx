"use client"

import { ROLE } from "@prisma/client"
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
import { RoleAccess } from "@/components/role-access"

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

  // const male = d?.cells.filter((c) => c.student.gender === Gender.MALE)

  // const female = d?.cells.filter((c) => c.student.gender === Gender.FEMALE)

  return (
    <div className="relative max-w-full">
      {d?.cells.length === 0 ? (
        <div className="bg-background/70 absolute inset-0 z-10 flex size-full flex-col items-center space-y-2 py-20 backdrop-blur-sm">
          <p className="text-lg font-semibold">No grading components found.</p>
          <RoleAccess role={ROLE.SCHOOLADMIN}>
            <p className="text-muted-foreground">
              It looks like the subject teacher have not set up the grading
              components for this class grading period yet. Please come back
              later.
            </p>
          </RoleAccess>
          <RoleAccess role={ROLE.TEACHER}>
            <p className="text-muted-foreground">
              It looks like you have not set up the grading components for this
              class grading period yet. Set them up first.
            </p>
          </RoleAccess>
        </div>
      ) : null}
      <Table className="table-auto">
        <TableHeader>
          <TableRow className="border-t-0">
            <TableHeadPlain className="w-10">#</TableHeadPlain>
            <TableHeadPlain className="whitespace-nowrap">
              Learner&apos;s Name
            </TableHeadPlain>
            <TableHeadPlain className="whitespace-nowrap text-center">
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
              Rank
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
          <TableRow className="hover:bg-transparent">
            {/* <TableCell
            colSpan={6 + (d?.heading.length ?? 0)}
            className="bg-accent/30 h-8 border-x py-0 text-xs font-semibold uppercase"
          >
            Male
          </TableCell> */}
          </TableRow>
          {d?.cells?.map((cell, studentIndex) => (
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
              <TableCell className="whitespace-nowrap border-r text-center first:border-l last:border-r">
                {cell.student.studentId}
              </TableCell>
              {d?.heading?.map((h) => (
                <TableCell
                  key={`row-${studentIndex}-cell-${h.id}`}
                  className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r"
                >
                  {cell[h.id]?.grade ? (
                    cell[h.id]?.grade.toFixed(0)
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
              ))}
              <TableCell className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r">
                {cell.average === 0 ? (
                  <span className="text-muted-foreground">N/A</span>
                ) : (
                  cell.average
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap border-r text-center font-mono text-emerald-500 first:border-l last:border-r">
                {studentIndex + 1}
              </TableCell>
              {["ELEM", "JHS", "SHS"].includes(d!.program) ? (
                <TableCell className="whitespace-nowrap border-r text-center first:border-l last:border-r">
                  {getRemark(cell.average)}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
          {/* <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={6 + (d?.heading.length ?? 0)}
            className="bg-accent/30 h-8 border-x py-0 text-xs font-semibold uppercase"
          >
            Female
          </TableCell>
        </TableRow>
        {female?.map((cell, studentIndex) => (
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
            <TableCell className="whitespace-nowrap border-r text-center first:border-l last:border-r">
              {cell.student.studentId}
            </TableCell>
            {d!.heading.map((h) => (
              <TableCell
                key={`row-${studentIndex}-cell-${h.id}`}
                className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r"
              >
                {cell[h.id]?.grade ? (
                  cell[h.id]?.grade.toFixed(0)
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
            ))}
            <TableCell className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r">
              {cell.average === 0 ? (
                <span className="text-muted-foreground">N/A</span>
              ) : (
                cell.average
              )}
            </TableCell>
            <TableCell className="whitespace-nowrap border-r text-center font-mono first:border-l last:border-r">
              Rank
            </TableCell>
            {["ELEM", "JHS", "SHS"].includes(d!.program) ? (
              <TableCell className="whitespace-nowrap border-r text-center first:border-l last:border-r">
                {getRemark(
                  d!.heading.map((h) => cell[h.id]?.grade).filter(Boolean)
                )}
              </TableCell>
            ) : null}
          </TableRow>
        ))} */}
        </TableBody>
      </Table>
    </div>
  )
}

function getRemark(average: number) {
  return k12Ranking.find((r) => average >= r.min && average <= r.max)?.remark
}
