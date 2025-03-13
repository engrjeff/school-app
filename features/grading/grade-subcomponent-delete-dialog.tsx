"use client"

import { useQueryClient } from "@tanstack/react-query"
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

import { deleteGradeSubComponent } from "./action"

export function GradeSubcomponentDeleteDialog({
  open,
  setOpen,
  gradeSubcomponentId,
}: {
  open: boolean
  setOpen: (state: boolean) => void
  gradeSubcomponentId: string
}) {
  const queryClient = useQueryClient()

  const action = useAction(deleteGradeSubComponent, {
    onError({ error }) {
      toast.error(
        error.serverError ??
          "The grade subcomponent was not deleted. Please try again."
      )
    },
    onSuccess() {
      toast.success("The grade subcomponent was deleted successfully!")
    },
  })

  const handleDelete = async () => {
    const result = await action.executeAsync({ id: gradeSubcomponentId })
    if (result?.data?.success) {
      await queryClient.refetchQueries({
        queryKey: ["periodic-grades"],
        type: "active",
      })

      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            grade subcomponent{" "}
            <span className="text-red-500">
              as well as the scores associated with it
            </span>
            . <br />
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
            I understand, continue.
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
