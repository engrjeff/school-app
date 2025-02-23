"use client"

import { useState } from "react"
import Link from "next/link"
import { Student } from "@prisma/client"
import {
  GridIcon,
  LibraryIcon,
  MoreHorizontal,
  PencilIcon,
  RotateCwSquareIcon,
  SigmaIcon,
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

type RowAction = "update" | "update-status"

export function StudentRowActions({ student }: { student: Student }) {
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
          <DropdownMenuItem onClick={() => setAction("update-status")}>
            <RotateCwSquareIcon className="size-3" /> Update Status
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`#`}>
              <GridIcon className="size-4" /> Enrollments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/courses/${student.currentCourseId}`}>
              <LibraryIcon className="size-4" /> View Course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`#`}>
              <SigmaIcon className="size-4" /> View Grades
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
