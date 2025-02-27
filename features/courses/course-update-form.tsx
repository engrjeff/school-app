"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Course } from "@prisma/client"
import { DialogClose } from "@radix-ui/react-dialog"
import { PencilIcon } from "lucide-react"
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

import { updateCourse } from "./action"
import { UpdateCourseInputs, updateCourseSchema } from "./schema"

export function CourseUpdateFormDialog({ course }: { course: Course }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="iconXXs"
          variant="ghost"
          aria-label={`update ${course.title}`}
          className="absolute right-2 top-1 hover:border"
        >
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {course.code ?? course.title}</DialogTitle>
          <DialogDescription>Make sure to save your changes.</DialogDescription>
        </DialogHeader>
        <CourseUpdateForm course={course} onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function CourseUpdateForm({
  onAfterSave,
  course,
}: {
  onAfterSave: VoidFunction
  course: Course
}) {
  const form = useForm<UpdateCourseInputs>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      id: course.id,
      title: course.title,
      description: course.description ?? "",
      code: course.code,
    },
  })

  const action = useAction(updateCourse, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<UpdateCourseInputs> = (errors) => {
    console.log("Update Course Error: ", errors)
  }

  const onSubmit: SubmitHandler<UpdateCourseInputs> = async (values) => {
    const result = await action.executeAsync(values)

    if (result?.data?.course) {
      toast.success("Course saved!")
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
          <p className="font-medium">Course Details</p>
          <input
            type="text"
            hidden
            defaultValue={course.id}
            {...form.register("id")}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Course title" {...field} />
                </FormControl>
                <FormDescription>The long name of the course.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="Code" {...field} />
                </FormControl>
                <FormDescription>
                  The short name for the course.
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
                    placeholder="Course description here..."
                    rows={7}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short text that describes this course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondaryOutline">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton type="submit" loading={action.isPending}>
            Save
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  )
}
