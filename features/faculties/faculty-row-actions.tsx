"use client"

import { useState } from "react"
import Link from "next/link"
import { Faculty } from "@prisma/client"
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  UserCogIcon,
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

import { FacultyDeleteDialog } from "./faculty-delete-dialog"
import { FacultyUpdateForm } from "./faculty-update-form"

type RowAction = "update" | "view-member" | "delete"

export function FacultyRowActions({ faculty }: { faculty: Faculty }) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <Button variant="link" onClick={() => setAction("update")}>
          Update
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Open edit menu">
              <MoreHorizontalIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
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
              <Link href={`/teachers?faculty=${faculty.id}`}>
                <UserCogIcon className="size-4" /> View Members
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setAction("delete")}
            >
              <TrashIcon className="size-3" /> Delete
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
            <DialogTitle>Update {faculty.title}</DialogTitle>
            <DialogDescription>
              Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <FacultyUpdateForm
            faculty={faculty}
            onAfterSave={() => setAction(undefined)}
          />
        </DialogContent>
      </Dialog>

      <FacultyDeleteDialog
        faculty={faculty}
        open={action === "delete"}
        setOpen={(open) => {
          if (!open) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
