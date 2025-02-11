import { Course, GradeYearLevel, Student } from "@prisma/client"
import { format } from "date-fns"
import { InboxIcon, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortLink } from "@/components/sort-link"

export function StudentsTable({
  students,
}: {
  students: Array<
    Student & {
      currentCourse: Course | null
      currentGradeYearLevel: GradeYearLevel | null
    }
  >
}) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>
            <SortLink title="Name" sortValue="lastName" />
          </TableHead>
          <TableHead className="text-right">
            <SortLink title="Student ID (LRN)" sortValue="studentId" />
          </TableHead>
          <TableHead className="text-center">
            <SortLink title="Gender" sortValue="gender" />
          </TableHead>
          <TableHead>
            <SortLink title="Birthdate" sortValue="birthdate" />
          </TableHead>
          <TableHead>Course</TableHead>
          <TableHead>
            <SortLink title="Status" sortValue="status" />
          </TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students?.length ? (
          students.map((student) => (
            <TableRow key={student.id} className="hover:bg-accent/50">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div>
                  <p>
                    {student.lastName}, {student.firstName} {student.suffix}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {student.email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {student.studentId}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={student.gender}>
                  {student.gender.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {student.birthdate
                  ? format(new Date(student.birthdate), "MMM dd, yyyy")
                  : "--"}
              </TableCell>
              <TableCell>
                {student.currentCourseId ? (
                  <div>
                    <p>
                      {student.currentCourse?.code ??
                        student.currentCourse?.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {student.currentGradeYearLevel?.displayName}{" "}
                      {student.currentGradeYearLevel?.level}
                    </p>
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Badge className="capitalize">
                  {student.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button type="button" size="icon" variant="ghost">
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={8} height={300}>
              <div className="text-muted-foreground flex flex-col justify-center text-center">
                <span>
                  <InboxIcon strokeWidth={1} className="inline-block" />
                </span>
                <p>No students listed yet.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
