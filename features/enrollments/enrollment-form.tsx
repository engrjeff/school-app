"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ClassSubject, EnrollmentClass } from "@prisma/client"
import { ArrowLeftIcon, PlusIcon, XCircleIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useCourses } from "@/hooks/use-courses"
import { useGradeYearLevels } from "@/hooks/use-grade-levels"
import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { useSchoolYears } from "@/hooks/use-schoolyears"
import { useSections } from "@/hooks/use-sections"
import { useSemesters } from "@/hooks/use-semesters"
import { useSubjects } from "@/hooks/use-subjects"
import { useTeachersByProgram } from "@/hooks/use-teachers-by-program"
import { AppCombobox } from "@/components/ui/app-combobox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"

import { createEnrollment } from "./actions"
import { EnrollmentInputs, enrollmentSchema } from "./schema"

export function EnrollmentForm({
  initialValues,
}: {
  initialValues?: Partial<EnrollmentClass & { subjects: ClassSubject[] }>
}) {
  const form = useForm<EnrollmentInputs>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      programOfferingId: initialValues?.programOfferingId ?? "",
      courseId: initialValues?.courseId ?? "",
      schoolYearId: initialValues?.schoolYearId ?? "",
      semesterId: initialValues?.semesterId ?? "",
      gradeYearLevelId: initialValues?.gradeYearLevelId ?? "",
      sectionId: "",
      subjects: initialValues?.subjects?.map((s) => ({
        subjectId: s.subjectId,
        teacherId: s.teacherId,
      })) ?? [{ subjectId: "", teacherId: "" }],
    },
  })

  const subjectFields = useFieldArray({
    control: form.control,
    name: "subjects",
  })

  const router = useRouter()

  const action = useAction(createEnrollment, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  // tracked values
  const programValue = form.watch("programOfferingId")
  const schoolYearValue = form.watch("schoolYearId")
  const courseValue = form.watch("courseId")
  const gradeYearLevelValue = form.watch("gradeYearLevelId")

  // options
  const programQuery = useProgramOfferings()
  const schoolYearQuery = useSchoolYears(programValue)
  const semesterQuery = useSemesters(schoolYearValue)
  const courseQuery = useCourses(programValue)
  const gradeYearLevelQuery = useGradeYearLevels(courseValue)
  const sectionQuery = useSections(gradeYearLevelValue)
  const subjectQuery = useSubjects(courseValue)
  const teacherQuery = useTeachersByProgram(programValue)

  const onError: SubmitErrorHandler<EnrollmentInputs> = (errors) => {
    console.log(`Create Enrollment Errors: `, errors)
  }

  const onSubmit: SubmitHandler<EnrollmentInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.enrollment?.id) {
      toast.success("Enrollment Saved!")
      router.replace(
        `/enrollments/${result?.data?.enrollment?.id}/enroll-students`
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="container max-w-screen-md py-2"
      >
        <div className="mb-4 flex items-start gap-4">
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
              Add New Enrollment
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href="/enrollments">Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Save & Add Students
            </SubmitButton>
          </div>
        </div>
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed"
          disabled={action.isPending}
        >
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Enrollment Details
          </p>

          <FormField
            control={form.control}
            name="programOfferingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program</FormLabel>
                <Select
                  disabled={programQuery.isLoading}
                  value={field.value}
                  onValueChange={(val) => {
                    form.setValue("schoolYearId", "")
                    form.setValue("semesterId", "")
                    form.setValue("courseId", "")
                    form.setValue("gradeYearLevelId", "")
                    form.setValue("sectionId", "")

                    field.onChange(val)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programQuery.data?.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The program to which this class belongs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="schoolYearId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Year</FormLabel>
                  <Select
                    disabled={schoolYearQuery.isLoading || !programValue}
                    value={field.value}
                    onValueChange={(val) => {
                      form.setValue("semesterId", "")

                      field.onChange(val)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schoolYearQuery.data?.map((sy) => (
                        <SelectItem key={sy.id} value={sy.id}>
                          S.Y. {sy.title}
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
              name="semesterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={semesterQuery.isLoading || !schoolYearValue}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesterQuery.data?.map((sem) => (
                        <SelectItem key={sem.id} value={sem.id}>
                          {sem.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    disabled={courseQuery.isLoading || !programValue}
                    value={field.value}
                    onValueChange={(val) => {
                      form.setValue("gradeYearLevelId", "")
                      form.setValue("sectionId", "")

                      field.onChange(val)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseQuery.data?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
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
              name="gradeYearLevelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade/Year Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={gradeYearLevelQuery.isLoading || !courseValue}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade/year level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeYearLevelQuery.data?.map((gy) => (
                        <SelectItem key={gy.id} value={gy.id}>
                          {gy.displayName} {gy.level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select
                    disabled={sectionQuery.isLoading || !gradeYearLevelValue}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectionQuery.data?.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <Separator className="my-6" />
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed"
          disabled={action.isPending}
        >
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Class Subjects
          </p>

          {subjectFields.fields.map((field, fieldIndex) => (
            <div
              key={`class-subject-${field.id}`}
              className={cn(
                "grid grid-cols-[1fr_1fr_40px] gap-4",
                fieldIndex === 0 ? "items-end" : ""
              )}
            >
              <FormField
                control={form.control}
                name={`subjects.${fieldIndex}.subjectId`}
                render={({ field }) => (
                  <FormItem className={cn(fieldIndex > 0 ? "space-y-0" : "")}>
                    <FormLabel className={cn(fieldIndex > 0 ? "sr-only" : "")}>
                      Subject
                    </FormLabel>
                    <AppCombobox
                      label="Select a subject"
                      inputPlaceholder="Search subject..."
                      disabled={subjectQuery.isLoading || !courseValue}
                      key={courseValue}
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        subjectQuery.data?.map((subject) => ({
                          label: subject.title,
                          value: subject.id,
                        })) ?? []
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`subjects.${fieldIndex}.teacherId`}
                render={({ field }) => (
                  <FormItem className={cn(fieldIndex > 0 ? "space-y-0" : "")}>
                    <FormLabel className={cn(fieldIndex > 0 ? "sr-only" : "")}>
                      Teacher
                    </FormLabel>
                    <AppCombobox
                      label="Select a teacher"
                      inputPlaceholder="Search teacher..."
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        teacherQuery.data?.map((teacher) => ({
                          label: [
                            teacher.firstName,
                            teacher.middleName,
                            teacher.lastName,
                            teacher.suffix,
                          ]
                            .filter(Boolean)
                            .join(" "),
                          value: teacher.id,
                        })) ?? []
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="remove subject"
                className="hover:text-red-500"
                disabled={subjectFields.fields.length === 1}
                onClick={() => subjectFields.remove(fieldIndex)}
              >
                <XCircleIcon />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="secondaryOutline"
            onClick={async () => {
              const isValidSoFar = await form.trigger("subjects")

              if (!isValidSoFar) return

              subjectFields.append({ subjectId: "", teacherId: "" })
            }}
          >
            <PlusIcon /> Add Subject
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}
