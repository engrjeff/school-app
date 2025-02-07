"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  CirclePlus,
  InboxIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form"
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
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

import { createCourse } from "./action"
import { CourseInputs, courseSchema } from "./schema"

export function CourseForm({ programId }: { programId: string }) {
  const session = useSession()

  const form = useForm<CourseInputs>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      code: "",
      programOfferingId: programId,
      schoolId: session?.data?.user.schoolId as string,
      subjects: [
        // {
        //   title: "College Algebra",
        //   code: "MATH1",
        //   units: 3.0,
        //   description: "",
        // },
        // {
        //   title: "Basic Electronics",
        //   code: "ELEC1",
        //   units: 3.0,
        //   description: "",
        // },
        // {
        //   title: "General Chemistry",
        //   code: "CHEM1",
        //   units: 2.0,
        //   description: "",
        // },
        // {
        //   title: "Physics 1",
        //   code: "PHYS1",
        //   units: 3.0,
        //   description: "",
        // },
        // {
        //   title: "Drawing 1",
        //   code: "DRAW1",
        //   units: 1.0,
        //   description: "",
        // },
        // {
        //   title:
        //     "Principles of Communications Longer title here yes yesy okayyy",
        //   code: "EST1",
        //   units: 3.0,
        //   description: "",
        // },
      ],
    },
  })

  const subjectFields = useFieldArray({
    control: form.control,
    name: "subjects",
  })

  const subjects = form.watch("subjects")

  const action = useAction(createCourse, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<CourseInputs> = (errors) => {
    console.error(`Course Fields Errors: `, errors)
  }

  const onSubmit: SubmitHandler<CourseInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.course) {
      toast.success(`Course saved!`)

      window.location.href = `/program-offerings/${programId}/courses`
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="mb-4 flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            asChild
          >
            <Link href={`/program-offerings/${programId}/courses`}>
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Add New Course</h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/program-offerings/${programId}/courses`}>
                Discard
              </Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Save Course
            </SubmitButton>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* course details */}
          <fieldset
            disabled={action.isPending}
            className="bg-accent/40 space-y-3 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
          >
            <p className="font-medium">Course Details</p>
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
                  <FormDescription>
                    The long name of the course.
                  </FormDescription>
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
          {/* course subjects */}
          <fieldset
            disabled={action.isPending}
            className="bg-accent/40 space-y-3 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Course Subjects</p>
              <SubjectDialog />
            </div>
            <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11">Title</TableHead>
                  <TableHead className="h-11">Code</TableHead>
                  <TableHead className="h-11 text-right">Units</TableHead>
                  <TableHead className="h-11 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length ? (
                  subjects.map((subjectField, sIndex) => (
                    <TableRow
                      key={`subject-${sIndex + 1}`}
                      className="hover:bg-accent/50"
                    >
                      <TableCell className="w-1/2 xl:w-[250px]">
                        <p className="line-clamp-1">{subjectField.title}</p>
                      </TableCell>
                      <TableCell>{subjectField.code}</TableCell>
                      <TableCell className="text-right">
                        {subjectField.units ?? "1.0"}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          type="button"
                          size="iconXs"
                          variant="outline"
                          aria-label="edit"
                        >
                          <PencilIcon />
                        </Button>
                        <Button
                          type="button"
                          size="iconXs"
                          variant="outline"
                          aria-label="delete"
                          className="text-destructive"
                          onClick={() => {
                            subjectFields.remove(sIndex)
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} height={300}>
                      <div className="text-muted-foreground flex flex-col justify-center text-center">
                        <span>
                          <InboxIcon strokeWidth={1} className="inline-block" />
                        </span>
                        <p>No subjects added yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </fieldset>
        </div>
      </form>
    </Form>
  )
}

function SubjectDialog() {
  const session = useSession()

  const [open, setOpen] = useState(false)

  const form = useFormContext<CourseInputs>()

  const subjects = useFieldArray({ control: form.control, name: "subjects" })

  const schoolId = session?.data?.user?.schoolId as string

  const index = subjects.fields.length - 1

  async function handleClose() {
    const isValid = await form.trigger(`subjects.${index}`, {
      shouldFocus: true,
    })

    if (!isValid) return

    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={async (isOpen) => {
        if (!isOpen) {
          const isValid = await form.trigger(`subjects.${index}`, {
            shouldFocus: true,
          })

          if (!isValid) {
            subjects.remove(index)
            setOpen(false)
          }
        } else {
          setOpen(isOpen)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={() =>
            subjects.append({
              title: "",
              code: "",
              units: 1.0,
              description: "",
              schoolId,
            })
          }
        >
          <CirclePlus /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course Subject</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name={`subjects.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Basic Electronics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`subjects.${index}.code`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Code</FormLabel>
                <FormControl>
                  <Input placeholder="ELEC1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`subjects.${index}.units`}
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
                    {...form.register(`subjects.${index}.units`, {
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
          name={`subjects.${index}.description`}
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
        <DialogFooter>
          <Button type="button" onClick={handleClose}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
