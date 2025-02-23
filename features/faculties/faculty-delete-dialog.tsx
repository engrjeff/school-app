"use client"

import { Faculty } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SubmitButton } from "@/components/ui/submit-button"

import { deleteFaculty } from "./actions"

export function FacultyDeleteDialog({
  open,
  setOpen,
  faculty,
}: {
  open: boolean
  setOpen: (state: boolean) => void
  faculty: Faculty
}) {
  const action = useAction(deleteFaculty, {
    onError({ error }) {
      toast.error(
        error.serverError ?? "The faculty was not deleted. Please try again."
      )
    },
    onSuccess() {
      toast.success("The faculty was deleted successfully!")
    },
  })

  const handleDelete = async () => {
    const result = await action.executeAsync({ id: faculty.id })
    if (result?.data?.success) {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <br />
            <span className="text-foreground text-center font-medium">
              {faculty.title}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={action.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
