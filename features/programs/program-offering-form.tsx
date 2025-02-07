"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CirclePlus } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { createProgram } from "./action"
import { ProgramInput, programSchema } from "./schema"

export function ProgramOfferingForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CirclePlus /> Add Program
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Program Offering</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <ProgramForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ProgramForm({ onAfterSave }: { onAfterSave: () => void }) {
  const form = useForm<ProgramInput>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
    },
  })

  const action = useAction(createProgram, {
    onError: ({ error }) => {
      if (error.serverError) {
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
    const result = await action.executeAsync(values)

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
                  <Input autoFocus placeholder="Program title" {...field} />
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
              Save
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
