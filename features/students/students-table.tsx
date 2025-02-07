import { MoreHorizontal } from "lucide-react"

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

export function StudentsTable() {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>
            <Checkbox />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Grade/Year Level</TableHead>
          <TableHead>Course</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((student) => (
          <TableRow key={student} className="hover:bg-accent/50">
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>Student {student + 1} Name</TableCell>
            <TableCell>student{student + 1}@email.com</TableCell>
            <TableCell>2nd Year</TableCell>
            <TableCell>Junior High School</TableCell>
            <TableCell className="text-center">
              <Button type="button" size="icon" variant="ghost">
                <MoreHorizontal />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
