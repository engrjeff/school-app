"use client"

import Link from "next/link"
import { Student } from "@prisma/client"
import {
  LibraryIcon,
  MoreHorizontal,
  PencilIcon,
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

export function StudentRowActions({ student }: { student: Student }) {
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
          <DropdownMenuItem asChild>
            <Link href={`/students/${student.id}/edit`}>
              <PencilIcon className="size-3" /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/courses/${student.currentCourseId}`}>
              <LibraryIcon className="size-4" /> View Course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild disabled>
            <Link href={`#`}>
              <SigmaIcon className="size-4" /> View Grades
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
