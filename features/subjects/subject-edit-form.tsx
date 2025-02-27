"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Subject } from "@prisma/client"
import { PencilIcon } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

import { updateSubject } from "./actions"
import { SubjectInputs, subjectSchema } from "./schema"

export function SubjectEditFormDialog({ subject }: { subject: Subject }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="iconXXs"
          variant="ghost"
          aria-label={`update ${subject.title}`}
          className="absolute right-2 top-1 hover:border"
        >
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {subject.title}</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <SubjectEditForm subject={subject} onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function SubjectEditForm({
  subject,
  onAfterSave,
}: {
  subject: Subject
  onAfterSave: VoidFunction
}) {
  const form = useForm<SubjectInputs>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      courseId: subject.courseId,
      title: subject.title,
      code: subject.code,
      units: subject.units,
      description: subject.description ?? "",
    },
  })

  const action = useAction(updateSubject, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<SubjectInputs> = (errors) => {
    console.log(`Subject Update Errors: `, errors)
  }

  const onSubmit: SubmitHandler<SubjectInputs> = async (data) => {
    const result = await action.executeAsync({ id: subject.id, ...data })

    if (result?.data?.subject) {
      toast.success(`Subject saved!`)

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
          <input
            type="text"
            hidden
            defaultValue={subject.courseId}
            {...form.register("courseId")}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. English 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ENG1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Units{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0.0"
                      min={0}
                      {...form.register("units", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-muted-foreground text-xs italic">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondaryOutline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton type="submit" loading={action.isPending}>
              Save
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
