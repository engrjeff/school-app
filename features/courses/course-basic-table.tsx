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

export function CourseBasicTable({
  courses,
}: {
  courses: Array<Course & { programOffering: ProgramOffering | null }>
}) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11">Title</TableHead>
          <TableHead className="h-11">Code</TableHead>
          <TableHead className="h-11">Description</TableHead>
          <TableHead className="h-11 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses?.length ? (
          courses?.map((course) => (
            <TableRow key={course.id} className="hover:bg-accent/50">
              <TableCell>
                <Link
                  href={`/courses/${course.id}`}
                  className="group inline-block"
                >
                  <div>
                    <p className="font-medium group-hover:underline">
                      {course.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {course.programOffering?.title}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="whitespace-nowrap">{course.code}</TableCell>
              <TableCell>
                <p className="line-clamp-2">{course.description ?? "-"}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap text-center">
                <CourseRowActions course={course} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} height={500}>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-base">No courses yet.</p>
                <p className="text-muted-foreground mb-4 text-center">
                  Add a course now.
                </p>
                <Button size="sm" className="h-9" asChild>
                  <Link href={`/courses/new`}>
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
