"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SubjectGradeSubComponent } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
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

import { updateGradeSubComponent } from "./action"
import { GradeSubComponentInputs, gradeSubComponentSchema } from "./schema"

interface Props {
  gradeSubcomponent: SubjectGradeSubComponent
  onAfterSave: VoidFunction
}

export function GradeSubComponentEditForm({
  onAfterSave,
  gradeSubcomponent,
}: Props) {
  const queryClient = useQueryClient()

  const form = useForm<GradeSubComponentInputs>({
    resolver: zodResolver(gradeSubComponentSchema),
    mode: "onChange",
    defaultValues: {
      gradingPeriodId: gradeSubcomponent.gradingPeriodId,
      classSubjectId: gradeSubcomponent.classSubjectId,
      parentGradeComponentId: gradeSubcomponent.gradeComponentId,
      order: gradeSubcomponent.order,
      highestPossibleScore: gradeSubcomponent.highestPossibleScore,
      title: gradeSubcomponent.title,
    },
  })

  const action = useAction(updateGradeSubComponent, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<GradeSubComponentInputs> = (errors) => {
    console.log(`Grade Sub Component Update Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeSubComponentInputs> = async (data) => {
    const result = await action.executeAsync({
      id: gradeSubcomponent.id,
      ...data,
    })

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
            defaultValue={gradeSubcomponent.order}
            {...form.register("order")}
          />
          <input
            type="text"
            hidden
            defaultValue={gradeSubcomponent.gradingPeriodId}
            {...form.register("gradingPeriodId")}
          />
          <input
            type="text"
            hidden
            defaultValue={gradeSubcomponent.classSubjectId}
            {...form.register("classSubjectId")}
          />
          <input
            type="text"
            hidden
            defaultValue={gradeSubcomponent.gradeComponentId}
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
          <SubmitButton
            loading={action.isPending}
            disabled={!form.formState.isDirty}
          >
            Save
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  )
}
