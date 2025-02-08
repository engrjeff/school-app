import { Subject } from "@prisma/client"
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

import { SubjectRowActions } from "./subject-row-actions"

export function SubjectsTable({ subjects }: { subjects: Subject[] }) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11">Title</TableHead>
          <TableHead className="h-11">Code</TableHead>
          <TableHead className="h-11">Description</TableHead>
          <TableHead className="h-11 text-right">Units</TableHead>
          <TableHead className="h-11 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects?.length ? (
          subjects?.map((subject) => (
            <TableRow key={subject.id} className="hover:bg-accent/50">
              <TableCell>{subject.title}</TableCell>
              <TableCell>{subject.code}</TableCell>
              <TableCell>{subject.description ?? "-"}</TableCell>
              <TableCell className="text-right">
                {subject.units.toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                <SubjectRowActions subject={subject} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} height={500}>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-base">No subjects yet.</p>
                <p className="text-muted-foreground mb-4 text-center">
                  Add a subject now.
                </p>
                <Button size="sm" className="h-9">
                  <PlusCircleIcon className="size-4" />
                  <span>Add Subject</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
