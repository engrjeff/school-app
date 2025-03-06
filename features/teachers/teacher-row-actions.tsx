"use client"

import { useState } from "react"
import Link from "next/link"
import { Class, Subject, Teacher } from "@prisma/client"
import {
  CircleCheckIcon,
  CopyIcon,
  GridIcon,
  InboxIcon,
  LibraryIcon,
  MoreHorizontal,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function getFullName(teacher: Teacher) {
  return [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
    teacher.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}

interface DetailedTeacher extends Teacher {
  classes: Array<
    Class & {
      subject: Subject
    }
  >
}

export function TeacherRowActions({ teacher }: { teacher: DetailedTeacher }) {
  const [action, setAction] = useState<"view-subjects">()

  const uniqueSubjectsObj = teacher.classes.reduce<Record<string, Subject>>(
    (subjects, c) => {
      if (!subjects[c.subjectId as keyof typeof subjects]) {
        return {
          ...subjects,
          [c.subjectId]: c.subject,
        }
      }

      return subjects
    },
    {}
  )

  const uniqueSubjects = Object.values(uniqueSubjectsObj)

  function handleCopy() {
    if (navigator.clipboard) {
      if (!location) return

      navigator.clipboard.writeText(
        `${window.location.origin}/sign-up/teacher?teacherId=${teacher.id}`
      )

      toast("Sign up link copied!", {
        position: "top-right",
        icon: <CircleCheckIcon className="size-4 text-emerald-500" />,
      })
    }
  }

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
            <Link href={`/teachers/${teacher.id}/edit`}>
              <PencilIcon className="size-3" /> Update
            </Link>
          </DropdownMenuItem>
          {teacher.userId ? null : (
            <DropdownMenuItem onClick={handleCopy}>
              <CopyIcon className="size-3" /> Copy Sign Up Link
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link prefetch href={`/classes?teacher=${teacher.id}`}>
              <GridIcon className="size-4" /> Classes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAction("view-subjects")}>
            <LibraryIcon className="size-4" /> Handled Subjects
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet
        open={action === "view-subjects"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <SheetContent
          side="right"
          className="bg-background inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-auto rounded-lg border p-0 focus-visible:outline-none sm:max-w-lg"
        >
          <SheetHeader className="space-y-1 border-b p-4 text-left">
            <SheetTitle>Handled Subjects</SheetTitle>
            <SheetDescription>
              Showing the subjects handled by {getFullName(teacher)}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-4">
            <p className="text-sm font-semibold">Subjects</p>
            {uniqueSubjects.length === 0 ? (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-6">
                <InboxIcon className="size-4" />
                <p>No subjects handled yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {uniqueSubjects.map((s) => (
                  <li key={s.id}>
                    <Card className="bg-accent/40 text-sm">
                      <CardHeader className="p-3">
                        <CardTitle>{s.title}</CardTitle>
                        <CardDescription>Code: {s.code}</CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
