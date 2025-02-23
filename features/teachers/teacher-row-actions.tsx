"use client"

import { useState } from "react"
import Link from "next/link"
import { Teacher } from "@prisma/client"
import { GridIcon, LibraryIcon, MoreHorizontal, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type RowAction = "update"

export function TeacherRowActions({ teacher }: { teacher: Teacher }) {
  const [action, setAction] = useState<RowAction>()

  console.log(action)

  return (
    <>
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
            <Link href={`#`}>
              <GridIcon className="size-4" /> Classes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`#`}>
              <LibraryIcon className="size-4" /> Handled Subjects
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
