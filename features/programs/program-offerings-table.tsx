import { ProgramOffering } from "@prisma/client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ProgramOfferingRowActions } from "./program-offering-row-actions"

export function ProgramOfferingsTable({
  programOfferings,
}: {
  programOfferings: ProgramOffering[]
}) {
  return (
    <Table className="table-auto">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-11">Title</TableHead>
          <TableHead className="h-11">Code</TableHead>
          <TableHead className="h-11">Description</TableHead>
          <TableHead className="h-11 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programOfferings.map((program) => (
          <TableRow key={program.id} className="hover:bg-accent/50">
            <TableCell className="font-medium">{program.title}</TableCell>
            <TableCell>{program.code}</TableCell>
            <TableCell>
              <p className="line-clamp-1">{program.description}</p>
            </TableCell>
            <TableCell className="text-center">
              <ProgramOfferingRowActions program={program} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
