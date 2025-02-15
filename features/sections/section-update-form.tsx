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

import { updateSection } from "./actions"
import { UpdateSectionInput, updateSectionSchema } from "./schema"

export function SectionUpdateForm({
  section,
  onCancel,
}: {
  section: Section
  onCancel: VoidFunction
}) {
  const form = useForm<UpdateSectionInput>({
    defaultValues: {
      id: section.id,
      name: section.name,
      order: section.order,
      gradeYearLevelId: section.gradeYearLevelId,
    },
    resolver: zodResolver(updateSectionSchema),
    mode: "onChange",
  })

  const action = useAction(updateSection, {
    onError: ({ error }) => {
      if (error.serverError) {
        const isDupError = error.serverError.includes(
          "Unique constraint failed on the fields: (`name`,`gradeYearLevelId`)"
        )

        if (isDupError) {
          form.setError(
            "name",
            { message: "Already exists." },
            { shouldFocus: true }
          )
          return
        }
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<UpdateSectionInput> = (errors) => {
    console.error(`Section Update Fields Errors: `, errors)
  }

  const onSubmit: SubmitHandler<UpdateSectionInput> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.section) {
      toast.success(`Section updated!`)

      onCancel()
      form.reset()
      window.location.reload()
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
            defaultValue={section.id}
            {...form.register("id")}
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
            <SubmitButton
              type="submit"
              size="sm"
              disabled={!form.formState.isDirty}
              loading={action.isPending}
            >
              Save
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
