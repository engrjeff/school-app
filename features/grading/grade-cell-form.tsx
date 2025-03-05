"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  GradeComponentPart,
  GradeComponentPartScore,
  StudentGrade,
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

import { upsertGradeScore } from "./action"
import {
  GradeComponentPartScoreInputs,
  gradeComponentPartScoreSchema,
} from "./schema"

export function GradeCellForm({
  studentGrade,
  gradeComponentPart,
  cellScore,
  refetch,
  column,
  row,
}: {
  studentGrade?: StudentGrade
  gradeComponentPart: GradeComponentPart
  cellScore: GradeComponentPartScore | undefined
  column: number
  row: number
  refetch: VoidFunction
}) {
  const form = useForm<GradeComponentPartScoreInputs>({
    resolver: zodResolver(gradeComponentPartScoreSchema),
    defaultValues: {
      scoreId: cellScore?.id,
      score: cellScore?.score,
      studentGradeId: studentGrade?.id,
      studentId: studentGrade?.studentId,
      gradingPeriodId: studentGrade?.gradingPeriodId,
      parentGradeComponentId: gradeComponentPart.gradeComponentId,
      gradeComponentPartId: gradeComponentPart.id,
    },
  })

  const action = useAction(upsertGradeScore, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<GradeComponentPartScoreInputs> = (
    errors
  ) => {
    console.log(`Upsert Grade Score Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeComponentPartScoreInputs> = async (
    data
  ) => {
    if (
      form.getValues("score") &&
      Number(form.getValues("score")) > gradeComponentPart.highestPossibleScore
    ) {
      form.setError(
        "score",
        { message: "Cannot be more than the highest possible score." },
        { shouldFocus: true }
      )

      return
    }

    if (!cellScore?.id && data.score === undefined) return

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
            defaultValue={studentGrade?.id}
            {...form.register("studentGradeId")}
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
            aria-label="grading period id"
            defaultValue={studentGrade?.gradingPeriodId}
            {...form.register("gradingPeriodId")}
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
                    className="size-10 rounded-none border-transparent p-0 text-center"
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
