"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Section } from "@prisma/client"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
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

import { importSections } from "./actions"
import { BulkSectionInput, bulkSectionSchema } from "./schema"

export function BulkSectionForm({
  gradeYearLevelId,
  currentSections,
  onCancel,
}: {
  gradeYearLevelId: string
  currentSections: Section[]
  onCancel: VoidFunction
}) {
  const form = useForm<BulkSectionInput>({
    mode: "onChange",
    resolver: zodResolver(bulkSectionSchema),
    defaultValues: {
      sections: [
        { name: "", order: currentSections.length + 1, gradeYearLevelId },
      ],
    },
  })

  const sectionFields = useFieldArray({
    control: form.control,
    name: "sections",
  })

  const nextOrder = currentSections.length

  const action = useAction(importSections, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<BulkSectionInput> = (errors) => {
    console.error(`Bulk Section Create Fields Errors: `, errors)
  }

  const onSubmit: SubmitHandler<BulkSectionInput> = async (data) => {
    // check if has dups
    const sections = form.getValues("sections").map((s) => s.name.toLowerCase())

    const existing = currentSections.some((s) =>
      sections.includes(s.name.toLowerCase())
    )

    if (existing) {
      const errorPosition = sections.length - 1

      form.setError(`sections.${errorPosition}.name`, {
        message: "Already exists",
      })
      return
    }

    const result = await action.executeAsync(data)

    if (result?.data?.sections) {
      toast.success(`Sections saved!`)

      onCancel()
      form.reset()
      window.location.reload()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex-1">
        <fieldset
          className="space-y-2 disabled:pointer-events-none disabled:cursor-not-allowed"
          disabled={action.isPending}
        >
          {sectionFields.fields.map((section, fieldIndex) => (
            <div key={section.id}>
              <input
                type="text"
                hidden
                defaultValue={gradeYearLevelId}
                {...form.register(`sections.${fieldIndex}.gradeYearLevelId`)}
              />
              <input
                type="text"
                hidden
                defaultValue={nextOrder + fieldIndex + 1}
                {...form.register(`sections.${fieldIndex}.order`)}
              />
              <FormField
                control={form.control}
                name={`sections.${fieldIndex}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-0">
                    <FormLabel className="sr-only">Section Name</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder={`Section ${fieldIndex + 1}`}
                          {...field}
                        />
                      </FormControl>
                      {sectionFields.fields.length === 1 ? null : (
                        <Button
                          type="button"
                          size="iconXXs"
                          variant="ghost"
                          aria-label="Remove"
                          className="absolute right-1 top-1/2 -translate-y-1/2 hover:border"
                          onClick={() => sectionFields.remove(fieldIndex)}
                          tabIndex={-1}
                        >
                          <TrashIcon className="size-3" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <div>
            <Button
              type="button"
              size="sm"
              variant="secondaryOutline"
              onClick={async () => {
                const isValidSoFar = await form.trigger("sections", {
                  shouldFocus: true,
                })

                if (!isValidSoFar) return

                sectionFields.append(
                  {
                    name: "",
                    order: nextOrder + form.watch("sections").length + 1,
                    gradeYearLevelId,
                  },
                  { shouldFocus: true }
                )
              }}
              disabled={action.isPending}
            >
              <PlusIcon /> Add
            </Button>
          </div>
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
