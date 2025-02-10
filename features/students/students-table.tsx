import { Student } from "@prisma/client"
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

export function StudentsTable({ students }: { students: Student[] }) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Student ID (LRN)</TableHead>
          <TableHead className="text-center">Gender</TableHead>
          <TableHead>Birthdate</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Status</TableHead>
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
              <TableCell>{student.currentCourseId ?? "--"}</TableCell>
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
