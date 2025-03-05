import Link from "next/link"
import { ProgramOffering } from "@prisma/client"
import { InboxIcon, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortLink } from "@/components/sort-link"

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
          <TableHead className="px-1">
            <SortLink title="Title" sortValue="title" />
          </TableHead>
          <TableHead className="px-1">
            <SortLink title="Code" sortValue="code" />
          </TableHead>
          <TableHead className="px-1">
            <SortLink title="Description" sortValue="description" />
          </TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programOfferings.length ? (
          programOfferings.map((program) => (
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
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} height={300}>
              <div className="text-muted-foreground flex flex-col items-center justify-center text-center">
                <span>
                  <InboxIcon strokeWidth={1} className="inline-block" />
                </span>
                <p className="mb-4">School curriculum not set up yet.</p>
                <Button asChild size="sm">
                  <Link href="/setup-curriculum">
                    <Settings /> Set up Curriculum
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
