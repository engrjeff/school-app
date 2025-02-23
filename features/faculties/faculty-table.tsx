import { Faculty, ProgramOffering } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortLink } from "@/components/sort-link"

import { FacultyFormDialog } from "./faculty-form"
import { FacultyImportDialog } from "./faculty-import-dialog"
import { FacultyRowActions } from "./faculty-row-actions"

export function FacultyTable({
  faculties,
}: {
  faculties: Array<Faculty & { programOffering: ProgramOffering }>
}) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>
            <SortLink title="Title" sortValue="title" />
          </TableHead>
          <TableHead>
            <SortLink title="Description" sortValue="description" />
          </TableHead>
          <TableHead className="h-11 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faculties?.length ? (
          faculties?.map((faculty) => (
            <TableRow key={faculty.id} className="hover:bg-accent/50">
              <TableCell>
                <div>
                  <p className="font-medium">{faculty.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {faculty.programOffering.title}
                  </p>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <p className="line-clamp-2">{faculty.description ?? "--"}</p>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <FacultyRowActions faculty={faculty} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} height={500}>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-base">
                  No school faculties yet.
                </p>
                <p className="text-muted-foreground mb-4 text-center">
                  Add a school faculty now or import from a file.
                </p>
                <div className="flex items-center space-x-3">
                  <FacultyImportDialog currentFaculties={faculties} />
                  <FacultyFormDialog />
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
