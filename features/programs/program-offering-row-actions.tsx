"use client"

import { useState } from "react"
import Link from "next/link"
import { ProgramOffering } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ProgramOfferingUpdateFormDialog } from "./program-offering-update-form"

type RowAction = "update"

export function ProgramOfferingRowActions({
  program,
}: {
  program: ProgramOffering
}) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="flex items-center justify-center">
        <Button variant="link" asChild>
          <Link href={`/program-offerings/${program.id}/courses`}>
            View Courses
          </Link>
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Open edit menu">
              <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex min-w-0 flex-col">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAction("update")}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem>Add Course</DropdownMenuItem>
            <DropdownMenuItem>View Teachers</DropdownMenuItem>
            <DropdownMenuItem>View Students</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProgramOfferingUpdateFormDialog
        program={program}
        open={action === "update"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
