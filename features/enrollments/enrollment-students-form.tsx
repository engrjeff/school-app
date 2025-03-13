"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnrollmentClass } from "@prisma/client"
import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useStudents } from "@/hooks/use-students"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { SubmitButton } from "@/components/ui/submit-button"

import { addStudentsToEnrollment } from "./actions"
import { EnrollmentStudentsPicker } from "./enrollment-student-picker"
import { ClassStudentsInput, classStudentsSchema } from "./schema"

interface Props {
  enrollment: EnrollmentClass
  label: string
}

export function EnrollmentStudentsForm({ enrollment, label }: Props) {
  const form = useForm<ClassStudentsInput>({
    resolver: zodResolver(classStudentsSchema),
    defaultValues: {
      enrollmentClassId: enrollment.id,
      studentIds: [],
    },
  })

  const studentsQuery = useStudents(
    enrollment.courseId,
    enrollment.gradeYearLevelId,
    enrollment.sectionId,
    true // unenrolled only
  )

  const router = useRouter()

  const action = useAction(addStudentsToEnrollment, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<ClassStudentsInput> = (errors) => {
    console.log(`Add Students to Enrollment Errors: `, errors)
  }

  const onSubmit: SubmitHandler<ClassStudentsInput> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.enrollment?.id) {
      toast.success("Enrollment Saved!")
      router.replace(`/enrollments`)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="container max-w-screen-md py-2"
      >
        <div className="mb-3 flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            onClick={router.back}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Enroll Students
            </h2>
            <p className="text-muted-foreground text-sm">
              Select students to enroll for {label}
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href="/enrollments">Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Confirm
            </SubmitButton>
          </div>
        </div>
        <fieldset className="space-y-3">
          <FormField
            control={form.control}
            name="studentIds"
            render={() => (
              <FormItem className="space-y-4">
                <FormLabel className="sr-only">Students</FormLabel>
                {form.formState.errors.studentIds?.message && (
                  <div className="bg-accent flex items-center gap-4 rounded border border-l-2 border-l-red-500 px-4 py-3">
                    <CircleAlertIcon
                      className="inline-flex text-red-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <p className="text-sm">
                      {form.formState.errors.studentIds?.message}
                    </p>
                  </div>
                )}
                <EnrollmentStudentsPicker
                  isLoading={studentsQuery.isLoading}
                  students={studentsQuery.data ?? []}
                />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  )
}
