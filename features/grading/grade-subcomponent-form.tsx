"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubjectGradeComponent } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { createGradeSubComponent } from "./action"
import { GradeSubComponentInputs, gradeSubComponentSchema } from "./schema"

interface Props {
  parentGradeComponent: SubjectGradeComponent
  classSubjectId: string
  gradingPeriodId: string
  order: number
}

export function GradeSubComponentFormDialog({
  parentGradeComponent,
  classSubjectId,
  gradingPeriodId,
  order,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="iconXXs"
          className="size-6"
          variant="secondaryOutline"
          aria-label={`Add Grade Subcomponent for ${parentGradeComponent.title}`}
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            Add Grade Subcomponent for {parentGradeComponent.title}
          </DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <GradeSubComponentForm
          parentGradeComponent={parentGradeComponent}
          classSubjectId={classSubjectId}
          gradingPeriodId={gradingPeriodId}
          order={order}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function GradeSubComponentForm({
  onAfterSave,
  parentGradeComponent,
  classSubjectId,
  gradingPeriodId,
  order,
}: Props & {
  onAfterSave: VoidFunction
}) {
  const queryClient = useQueryClient()

  const form = useForm<GradeSubComponentInputs>({
    resolver: zodResolver(gradeSubComponentSchema),
    mode: "onChange",
    defaultValues: {
      gradingPeriodId,
      classSubjectId,
      parentGradeComponentId: parentGradeComponent.id,
      order,
      highestPossibleScore: 0,
      title:
        parentGradeComponent.title
          .split(" ")
          .map((c) => c.charAt(0).toUpperCase())
          .join("") + order.toString(),
    },
  })

  const action = useAction(createGradeSubComponent, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<GradeSubComponentInputs> = (errors) => {
    console.log(`Grade Sub Component Create Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeSubComponentInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.gradeSubComponent) {
      toast.success(`Grade subcomponent saved!`)

      form.reset()

      await queryClient.refetchQueries({
        queryKey: ["periodic-grades"],
        type: "active",
      })

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
          <input
            type="text"
            hidden
            defaultValue={order}
            {...form.register("order")}
          />
          <input
            type="text"
            hidden
            defaultValue={gradingPeriodId}
            {...form.register("gradingPeriodId")}
          />
          <input
            type="text"
            hidden
            defaultValue={classSubjectId}
            {...form.register("classSubjectId")}
          />
          <input
            type="text"
            hidden
            defaultValue={parentGradeComponent.id}
            {...form.register("parentGradeComponentId")}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="highestPossibleScore"
            render={() => (
              <FormItem>
                <FormLabel>Highest Possible Score</FormLabel>
                <FormControl>
                  <NumberInput
                    className="w-1/4"
                    {...form.register("highestPossibleScore", {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
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
