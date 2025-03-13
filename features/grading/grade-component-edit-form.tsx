"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubjectGradeComponent } from "@prisma/client"
import { Edit2Icon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { updateGradeComponent } from "./action"
import { GradeComponentInputs, gradeComponentSchema } from "./schema"

export function GradeComponentEditFormDialog({
  gradeComponent,
}: {
  gradeComponent: SubjectGradeComponent
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconXXs"
          variant="ghost"
          aria-label={`Edit ${gradeComponent.title}`}
          className="absolute right-1 top-1"
        >
          <Edit2Icon size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Update {gradeComponent.title}</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <GradeComponentEditForm
          onAfterSave={() => setOpen(false)}
          gradeComponent={gradeComponent}
        />
      </DialogContent>
    </Dialog>
  )
}

export function GradeComponentEditForm({
  onAfterSave,
  gradeComponent,
}: {
  onAfterSave: VoidFunction
  gradeComponent: SubjectGradeComponent
}) {
  const form = useForm<GradeComponentInputs>({
    resolver: zodResolver(gradeComponentSchema),
    mode: "onChange",
    defaultValues: {
      label: gradeComponent.label,
      title: gradeComponent.title,
      percentage: gradeComponent.percentage,
    },
  })

  const action = useAction(updateGradeComponent, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<GradeComponentInputs> = (errors) => {
    console.log(`Grade Component Update Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeComponentInputs> = async (data) => {
    const result = await action.executeAsync({
      id: gradeComponent.id,
      label: data.label,
      title: data.title,
      percentage: data.percentage,
    })

    if (result?.data?.gradeComponent) {
      toast.success(`Grade component saved!`)

      form.reset()

      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-not-allowed disabled:opacity-90"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Label" {...field} />
                </FormControl>
                <FormDescription>e.g. Written Works for MATH 1</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>e.g. Written Works</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="percentage"
            render={() => (
              <FormItem className="w-1/4">
                <FormLabel>Percentage (%)</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0.0"
                    min={0}
                    max={1}
                    step="any"
                    {...form.register("percentage", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormDescription>e.g. 0.2 for 20%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="secondaryOutline">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton loading={action.isPending}>Save</SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  )
}
