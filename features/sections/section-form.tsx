"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Section } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"

import { createSection } from "./actions"
import { SectionInput, sectionSchema } from "./schema"

interface Props {
  gradeYearLevelId: string
  currentSections: Section[]
  onCancel: VoidFunction
}

export function SectionForm({
  gradeYearLevelId,
  currentSections,
  onCancel,
}: Props) {
  const form = useForm<SectionInput>({
    defaultValues: {
      name: "",
      order: currentSections.length + 1,
      gradeYearLevelId,
    },
    resolver: zodResolver(sectionSchema),
    mode: "onChange",
  })

  const action = useAction(createSection, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<SectionInput> = (errors) => {
    console.error(`Section Fields Errors: `, errors)
  }

  const onSubmit: SubmitHandler<SectionInput> = async (data) => {
    // check if has dups
    const existing = currentSections.find(
      (s) => s.name.toLowerCase() === form.watch("name").toLowerCase()
    )

    if (existing) {
      form.setError("name", { message: "Already exists" })
      return
    }

    const result = await action.executeAsync(data)

    if (result?.data?.section) {
      toast.success(`Section saved!`)

      onCancel()
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          className="space-y-2 disabled:pointer-events-none disabled:cursor-not-allowed"
          disabled={action.isPending}
        >
          <input
            type="text"
            hidden
            defaultValue={gradeYearLevelId}
            {...form.register("gradeYearLevelId")}
          />
          <input
            type="text"
            hidden
            defaultValue={currentSections.length + 1}
            {...form.register("order")}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormLabel className="sr-only">Section Name</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Section name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondaryOutline"
              onClick={onCancel}
              disabled={action.isPending}
            >
              Cancel
            </Button>
            <SubmitButton type="submit" size="sm" loading={action.isPending}>
              Save
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
