"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
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
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { createCorrectResponse } from "./action"
import { CorrectResponseInputs, correctResponseSchema } from "./schema"

interface CorrectResponseFormProps {
  gradeSubComponentId: string
  studentCount: number
  expectedQuestionCount: number
  onAfterSave: () => void
}

export function CorrectResponseForm({
  onAfterSave,
  gradeSubComponentId,
  studentCount,
  expectedQuestionCount,
}: CorrectResponseFormProps) {
  const form = useForm<CorrectResponseInputs>({
    resolver: zodResolver(correctResponseSchema),
    defaultValues: {
      gradeSubComponentId,
      studentCount,
      items: Array.from(Array(expectedQuestionCount).keys()).map((n) => ({
        question: "",
        correctCount: n * 0,
      })),
    },
  })

  const questions = useFieldArray({ control: form.control, name: "items" })

  const action = useAction(createCorrectResponse, {
    onError({ error }) {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<CorrectResponseInputs> = (error) => {
    console.error("Create Correct Response Error: ", error)
  }

  const onSubmit: SubmitHandler<CorrectResponseInputs> = async (data) => {
    // validate if there are `correctCount` that are higher than the studentCount
    const withInvalidCorrectCount = data.items.findIndex(
      (q) => q.correctCount > data.studentCount
    )

    if (withInvalidCorrectCount !== -1) {
      form.setError(`items.${withInvalidCorrectCount}.correctCount`, {
        message: "Invalid.",
      })
      return
    }

    const result = await action.executeAsync(data)

    if (result?.data?.correctResponse?.id) {
      toast.success("Correct response saved!")
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <p className="text-muted-foreground mb-2 text-xs uppercase">
          Student Count: <span className="font-semibold">{studentCount}</span>
        </p>
        <fieldset
          disabled={action.isPending}
          className="max-h-[400px] space-y-3 overflow-y-auto pb-4 pl-1 pr-4 disabled:opacity-90"
        >
          {questions.fields.map((question, qIndex) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_120px_40px] items-start gap-4"
            >
              <FormField
                control={form.control}
                name={`items.${qIndex}.question`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question #{qIndex + 1}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter question here"
                        rows={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${qIndex}.correctCount`}
                render={() => (
                  <FormItem>
                    <FormLabel>Correct Response</FormLabel>
                    <FormControl>
                      <NumberInput
                        {...form.register(`items.${qIndex}.correctCount`, {
                          valueAsNumber: true,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="remove question"
                className="mt-8 hover:text-red-500"
                tabIndex={-1}
                disabled={questions.fields.length === 1}
                onClick={() => questions.remove(qIndex)}
              >
                <XCircleIcon />
              </Button>
            </div>
          ))}
        </fieldset>

        <DialogFooter className="border-t pt-6">
          <Button
            type="button"
            variant="outline"
            className="mr-auto"
            onClick={async () => {
              const isValidSoFar = await form.trigger("items", {
                shouldFocus: true,
              })

              if (!isValidSoFar) return

              questions.append({ question: "", correctCount: 0 })
            }}
          >
            <PlusIcon /> Add Question
          </Button>
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
