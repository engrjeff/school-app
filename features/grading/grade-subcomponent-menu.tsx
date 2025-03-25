"use client"

import { useState } from "react"
import { ROLE, SubjectGradeSubComponent } from "@prisma/client"
import {
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleAccess } from "@/components/role-access"

import { GradeSubcomponentDeleteDialog } from "./grade-subcomponent-delete-dialog"
import { GradeSubComponentEditForm } from "./grade-subcomponent-edit-form"

type Action = "edit" | "delete" | "correct-response"

export function GradeSubcomponentMenu({
  gradeSubcomponent,
}: {
  gradeSubcomponent: SubjectGradeSubComponent
}) {
  const [action, setAction] = useState<Action>()

  return (
    <>
      <RoleAccess
        role={ROLE.TEACHER}
        fallback={<span>{gradeSubcomponent.title}</span>}
      >
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="iconXXs"
              variant="ghost"
              className="group hover:bg-transparent"
              aria-label={`View actions for ${gradeSubcomponent.title}`}
            >
              <span className="inline-block text-xs group-hover:hidden group-data-[state=open]:hidden">
                {gradeSubcomponent.title}
              </span>{" "}
              <MoreHorizontalIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="hidden group-hover:inline-block group-data-[state=open]:inline-block"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <PencilIcon /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAction("correct-response")}>
              <CheckIcon /> Correct Response
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setAction("delete")}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </RoleAccess>

      <Dialog
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              Edit Grade Subcomponent: {gradeSubcomponent.title}
            </DialogTitle>
            <DialogDescription>
              Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <GradeSubComponentEditForm
            gradeSubcomponent={gradeSubcomponent}
            onAfterSave={() => setAction(undefined)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={action === "correct-response"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              Create Correct Response Document: {gradeSubcomponent.title}
            </DialogTitle>
            <DialogDescription>
              Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          Tadah
        </DialogContent>
      </Dialog>

      <GradeSubcomponentDeleteDialog
        gradeSubcomponentId={gradeSubcomponent.id}
        open={action === "delete"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
