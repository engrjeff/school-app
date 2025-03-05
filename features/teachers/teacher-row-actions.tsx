"use client"

import Link from "next/link"
import { Teacher } from "@prisma/client"
import {
  CircleCheckIcon,
  CopyIcon,
  GridIcon,
  LibraryIcon,
  MoreHorizontal,
  PencilIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TeacherRowActions({ teacher }: { teacher: Teacher }) {
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
