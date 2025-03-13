"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  SubjectGrade,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updateSubjectGradeScore } from "../grading/action"
import {
  GradeSubComponentScoreInputs,
  gradeSubComponentScoreSchema,
} from "../grading/schema"

export function GradeCellForm({
  subjectGrade,
  gradeSubComponent,
  cellScore,
  refetch,
  column,
  row,
}: {
  subjectGrade?: SubjectGrade
  gradeSubComponent: SubjectGradeSubComponent
  cellScore: SubjectGradeSubComponentScore
  column: number
  row: number
  refetch: VoidFunction
}) {
  const form = useForm<GradeSubComponentScoreInputs>({
    resolver: zodResolver(gradeSubComponentScoreSchema),
    defaultValues: {
      scoreId: cellScore.id,
      score: cellScore.score ?? undefined,
      subjectGradeId: subjectGrade?.id,
      subjectGradeComponentId: gradeSubComponent.gradeComponentId,
      subjectGradeSubComponentId: gradeSubComponent.id,
    },
  })

  const action = useAction(updateSubjectGradeScore, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<GradeSubComponentScoreInputs> = (
    errors
  ) => {
    console.log(`Update Subject Grade Score Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeSubComponentScoreInputs> = async (
    data
  ) => {
    if (
      form.getValues("score") &&
      Number(form.getValues("score")) > gradeSubComponent.highestPossibleScore
    ) {
      form.setError(
        "score",
        { message: "Cannot be more than the highest possible score." },
        { shouldFocus: true }
      )

      return
    }

    if (isNaN(Number(form.getValues("score"))) && cellScore.score === null)
      return

    const result = await action.executeAsync(data)

    if (result?.data?.score?.id) {
      await refetch()
    }
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onChange={() => {
          form.clearErrors()
        }}
        onBlur={form.handleSubmit(onSubmit, onError)}
      >
        <fieldset>
          <input
            type="text"
            hidden
            className="sr-only"
            aria-label="Student grade id"
            defaultValue={subjectGrade?.id}
            {...form.register("subjectGradeId")}
          />
          <input
            type="text"
            hidden
            className="sr-only"
            aria-label="Score id"
            defaultValue={cellScore?.id}
            {...form.register("scoreId")}
          />
          <input
            type="text"
            hidden
            className="sr-only"
            aria-label="grade component id"
            defaultValue={gradeSubComponent.gradeComponentId}
            {...form.register("subjectGradeComponentId")}
          />
          <input
            type="text"
            hidden
            className="sr-only"
            aria-label="grade subcomponent id"
            defaultValue={gradeSubComponent.id}
            {...form.register("subjectGradeSubComponentId")}
          />
          <FormField
            control={form.control}
            name="score"
            render={({ fieldState }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Grade</FormLabel>
                <FormControl>
                  <Input
                    data-pos={`${row}-${column}`}
                    title={fieldState.error?.message ?? undefined}
                    inputMode="numeric"
                    className="h-10 w-full rounded-none border-transparent p-0 text-center"
                    {...form.register("score", { valueAsNumber: true })}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  )
}
