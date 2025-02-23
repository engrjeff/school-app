"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Faculty } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { updateFaculty } from "./actions"
import { UpdateFacultyInputs, updateFacultySchema } from "./schema"

export function FacultyUpdateForm({
  faculty,
  onAfterSave,
}: {
  faculty: Faculty
  onAfterSave: VoidFunction
}) {
  const programs = useProgramOfferings()

  const form = useForm<UpdateFacultyInputs>({
    resolver: zodResolver(updateFacultySchema),
    defaultValues: {
      id: faculty.id,
      title: faculty.title,
      description: faculty.description,
      programOfferingId: faculty.programOfferingId,
    },
  })

  const action = useAction(updateFaculty, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<UpdateFacultyInputs> = (errors) => {
    console.log("Update Faculty Error: ", errors)
  }

  const onSubmit: SubmitHandler<UpdateFacultyInputs> = async (values) => {
    const result = await action.executeAsync(values)

    if (result?.data?.faculty) {
      toast.success("Faculty saved!")
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-wait disabled:opacity-90"
        >
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Faculty Details
          </p>
          <input
            type="text"
            hidden
            defaultValue={faculty.id}
            {...form.register("id")}
          />
          <FormField
            control={form.control}
            name="programOfferingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program</FormLabel>
                <Select
                  disabled={programs.isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program offering." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programs.data?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code ?? p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Faculty/Department title" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the faculty/department.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descriptiom</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Faculty description here..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short text that describes this faculty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="secondaryOutline">
            Cancel
          </Button>
          <SubmitButton type="submit" loading={action.isPending}>
            Save
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
