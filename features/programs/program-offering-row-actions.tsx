"use client"

import { useState } from "react"
import Link from "next/link"
import { ProgramOffering } from "@prisma/client"
import {
  LayoutPanelTopIcon,
  MoreHorizontal,
  PencilIcon,
  PlusIcon,
  Table2Icon,
  UserCheckIcon,
  UserCogIcon,
} from "lucide-react"

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
          <Link href={`/courses?program=${program.id}`}>View Courses</Link>
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
              <PencilIcon className="size-3" /> Update
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/new?program=${program.id}`}>
                <PlusIcon className="size-4" /> Add Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/students?program=${program.id}`}>
                <UserCheckIcon className="size-4" /> View Students
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/classes?program=${program.id}`}>
                <Table2Icon className="size-4" /> View Classes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/teachers?program=${program.id}`}>
                <UserCogIcon className="size-4" /> View Teachers
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/faculties?program=${program.id}`}>
                <LayoutPanelTopIcon className="size-4" /> View Faculties
              </Link>
            </DropdownMenuItem>
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
