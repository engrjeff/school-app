import { zodResolver } from "@hookform/resolvers/zod"
import { ProgramOffering } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { updateProgram } from "./action"
import { ProgramInput, programSchema } from "./schema"

interface ProgramOfferingUpdateFormDialogProps {
  open: boolean
  setOpen: (v: boolean) => void
  program: ProgramOffering
}

export function ProgramOfferingUpdateFormDialog({
  open,
  setOpen,
  program,
}: ProgramOfferingUpdateFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {program.title}</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <ProgramOfferingUpdateForm
          program={program}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function ProgramOfferingUpdateForm({
  onAfterSave,
  program,
}: {
  onAfterSave: () => void
  program: ProgramOffering
}) {
  const form = useForm<ProgramInput>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: program.title,
      description: program.description,
      code: program.code,
    },
  })

  const action = useAction(updateProgram, {
    onError: ({ error }) => {
      if (error.serverError) {
        if (
          error.serverError.includes(
            "Unique constraint failed on the fields: (`schoolId`,`title`)"
          )
        ) {
          form.setError(
            "title",
            { message: "This program title is already in use." },
            { shouldFocus: true }
          )
          return
        }
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<ProgramInput> = (errors) => {
    console.log("Create Program Offering Error: ", errors)
  }

  const onSubmit: SubmitHandler<ProgramInput> = async (
    values: ProgramInput
  ) => {
    const result = await action.executeAsync({
      id: program.id,
      ...values,
    })

    if (result?.data?.program) {
      toast.success("Program offering saved!")
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-2 disabled:cursor-wait"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Program title" {...field} />
                </FormControl>
                <FormDescription>e.g. Senior High School</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Program code" {...field} />
                </FormControl>
                <FormDescription>e.g. SHS</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Program description" {...field} />
                </FormControl>
                <FormDescription>e.g. Grade 11-12</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <SubmitButton type="submit" loading={action.isPending}>
              Save Changes
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
