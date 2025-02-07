"use client"

import { useState } from "react"
import Link from "next/link"
import { Course } from "@prisma/client"
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

type RowAction = "update" | "add-subject"

export function CourseRowActions({ course }: { course: Course }) {
  const [action, setAction] = useState<RowAction>()

  console.log(action, course.title)

  return (
    <>
      <div className="flex items-center justify-center">
        <Button variant="link" asChild>
          <Link href={"#"}>View Subjects</Link>
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
            <DropdownMenuItem>Add Subject</DropdownMenuItem>
            <DropdownMenuItem>View Teachers</DropdownMenuItem>
            <DropdownMenuItem>View Students</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
