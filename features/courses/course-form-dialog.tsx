"use client"

import { useState } from "react"
import { PlusCircleIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

import { CourseInputs } from "./schema"

export function CourseFormDialog({ programId }: { programId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-9">
          <PlusCircleIcon className="size-4" />
          <span>Add Course</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-background inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border p-0 focus-visible:outline-none sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>Add Course</SheetTitle>
          <SheetDescription>Fill in the details below.</SheetDescription>
        </SheetHeader>
        <CourseForm programId={programId} onAfterSave={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function CourseForm({
  onAfterSave,
  programId,
}: {
  onAfterSave: VoidFunction
  programId: string
}) {
  const session = useSession()

  const form = useForm<CourseInputs>({
    defaultValues: {
      title: "",
      code: "",
      programOfferingId: programId,
      schoolId: session?.data?.user.schoolId as string,
      subjects: [],
    },
  })

  return (
    <Form {...form}>
      <form>
        <fieldset className="space-y-3 p-4 disabled:cursor-wait disabled:opacity-90">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Bachelor of Science in Electronics Engineering"
                    {...field}
                  />
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
                  <Input placeholder="BSECE" {...field} />
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
      </form>
    </Form>
  )
}
