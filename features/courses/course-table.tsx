import Link from "next/link"
import { Course, ProgramOffering } from "@prisma/client"
import { PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CourseRowActions } from "./course-row-actions"

export function CourseTable({
  program,
}: {
  program: ProgramOffering & { courses: Course[] }
}) {
  return (
    <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11">Title</TableHead>
          <TableHead className="h-11">Code</TableHead>
          <TableHead className="h-11">Description</TableHead>
          <TableHead className="h-11 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {program.courses?.length ? (
          program.courses?.map((course) => (
            <TableRow key={course.id} className="hover:bg-accent/50">
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.description ?? "-"}</TableCell>
              <TableCell className="text-center">
                <CourseRowActions course={course} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} height={500}>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-base">
                  No courses for {program.title} yet.
                </p>
                <p className="text-muted-foreground mb-4 text-center">
                  Add a course now.
                </p>
                <Button size="sm" className="h-9" asChild>
                  <Link href={`/program-offerings/${program.id}/courses/new`}>
                    <PlusCircleIcon className="size-4" />
                    <span>Add Course</span>
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
