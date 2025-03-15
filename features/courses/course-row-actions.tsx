"use client"

import { useState } from "react"
import Link from "next/link"
import { Course } from "@prisma/client"
import {
  BookCheck,
  LibraryIcon,
  MoreHorizontal,
  Pencil,
  Table2Icon,
  UserCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CourseUpdateForm } from "./course-update-form"

type RowAction = "update" | "add-subject"

export function CourseRowActions({ course }: { course: Course }) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="flex items-center justify-center">
        <Button variant="link" asChild>
          <Link href={`/courses/${course.id}`}>View</Link>
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
            <DropdownMenuItem asChild>
              <Link
                href={`/classes?program=${course.programOfferingId}&course=${course.id}`}
              >
                <Table2Icon />
                Classes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/enrollments?program=${course.programOfferingId}&course=${course.id}`}
              >
                <LibraryIcon />
                Enrollments
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/students?course=${course.id}`}>
                <UserCheck />
                Enrolled Students
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/teachers?course=${course.id}`}>
                <BookCheck />
                Teachers
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAction("update")}>
              <Pencil /> Update
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={action === "update"}
        onOpenChange={(open) => {
          if (!open) {
            setAction(undefined)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {course.code ?? course.title}</DialogTitle>
            <DialogDescription>
              Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <CourseUpdateForm
            course={course}
            onAfterSave={() => setAction(undefined)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
