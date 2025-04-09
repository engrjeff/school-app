"use client"

import { useState } from "react"
import {
  CorrectResponse,
  CorrectResponseItem,
  ROLE,
  SubjectGradeSubComponent,
} from "@prisma/client"
import { DialogClose } from "@radix-ui/react-dialog"
import {
  CheckIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import { CorrectResponseForm } from "./correct-response-form"
import { CorrectResponseTally } from "./correct-response-tally"
import { GradeSubcomponentDeleteDialog } from "./grade-subcomponent-delete-dialog"
import { GradeSubComponentEditForm } from "./grade-subcomponent-edit-form"

type Action = "edit" | "delete" | "correct-response" | "view-correct-response"

export function GradeSubcomponentMenu({
  gradeSubcomponent,
  studentCount,
}: {
  studentCount: number
  gradeSubcomponent: SubjectGradeSubComponent & {
    correctResponse: null | (CorrectResponse & { items: CorrectResponseItem[] })
  }
}) {
  const [action, setAction] = useState<Action>()

  return (
    <>
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
          <RoleAccess role={ROLE.TEACHER}>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <PencilIcon /> Edit
            </DropdownMenuItem>
          </RoleAccess>
          <RoleAccess role={ROLE.SCHOOLADMIN}>
            <DropdownMenuItem
              onClick={() => setAction("view-correct-response")}
            >
              <CheckIcon /> Correct Response
            </DropdownMenuItem>
          </RoleAccess>
          <RoleAccess role={ROLE.TEACHER}>
            {gradeSubcomponent.correctResponse ? (
              <DropdownMenuItem
                onClick={() => setAction("view-correct-response")}
              >
                <CheckIcon /> View Correct Response
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setAction("correct-response")}>
                <CheckIcon /> Create Correct Response
              </DropdownMenuItem>
            )}
          </RoleAccess>
          <RoleAccess role={ROLE.TEACHER}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setAction("delete")}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </RoleAccess>
        </DropdownMenuContent>
      </DropdownMenu>

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
              Make sure to save after you are done.
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
        <DialogContent
          className="sm:max-w-screen-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Create Correct Response for: {gradeSubcomponent.title}
            </DialogTitle>
            <DialogDescription>
              Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <CorrectResponseForm
            gradeSubComponentId={gradeSubcomponent.id}
            studentCount={studentCount}
            expectedQuestionCount={gradeSubcomponent.highestPossibleScore}
            onAfterSave={() => setAction(undefined)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={action === "view-correct-response"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      >
        <DialogContent
          className="sm:max-w-screen-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Correct Response for: {gradeSubcomponent.title}
            </DialogTitle>
            <DialogDescription>
              Showing correct response tally for{" "}
              {gradeSubcomponent.correctResponse?.items?.length} questions.
            </DialogDescription>
          </DialogHeader>
          {gradeSubcomponent.correctResponse ? (
            <CorrectResponseTally
              correctResponse={gradeSubcomponent.correctResponse}
            />
          ) : (
            <div className="bg-accent rounded border border-l-2 border-l-blue-500 px-4 py-3">
              <p className="text-sm">
                <InfoIcon
                  className="-mt-0.5 me-3 inline-flex text-blue-500"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                No correct response yet for {gradeSubcomponent.title}. Ask the
                subject teacher to create one first.
              </p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
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
