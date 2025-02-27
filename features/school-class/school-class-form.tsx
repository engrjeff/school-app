"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProgramOffering, SchoolYear, Semester } from "@prisma/client"
import { ArrowLeft, CircleAlertIcon, PlusIcon, TrashIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"

import { useCourses } from "@/hooks/use-courses"
import { useGradeYearLevels } from "@/hooks/use-grade-levels"
import { useSections } from "@/hooks/use-sections"
import { useStudents } from "@/hooks/use-students"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/ui/submit-button"

import { createSchoolClass } from "./actions"
import { SchoolClassInputs, schoolClassSchema } from "./schema"
import { StudentsPicker } from "./students-picker"

const gradingPeriodsMap = {
  JHS: [
    {
      title: "Q1",
    },
    {
      title: "Q2",
    },
    {
      title: "Q3",
    },
    {
      title: "Q4",
    },
  ],
  SHS: [{ title: "1st Grading" }, { title: "2nd Grading" }],
}

const collegGradingPeriods = [
  { title: "Prelim" },
  { title: "Midterm" },
  { title: "Finals" },
]

export function SchoolClassForm({
  schoolYear,
  semesterId,
}: {
  schoolYear: SchoolYear & {
    programOffering: ProgramOffering
    semesters: Semester[]
  }
  semesterId: string
}) {
  const form = useForm<SchoolClassInputs>({
    resolver: zodResolver(schoolClassSchema),
    mode: "onChange",
    defaultValues: {
      programOfferingId: schoolYear.programOfferingId,
      schoolYearId: schoolYear.id,
      semesterId: semesterId,
      studentIds: [],
      gradingPeriods:
        gradingPeriodsMap[
          schoolYear.programOffering.code as keyof typeof gradingPeriodsMap
        ] ?? collegGradingPeriods,
    },
  })

  const gradingPeriodFields = useFieldArray({
    control: form.control,
    name: "gradingPeriods",
  })

  const programId = form.watch("programOfferingId")
  const courseId = form.watch("courseId")
  const gradeYearLevelId = form.watch("gradeYearLevelId")
  const sectionId = form.watch("sectionId")

  // courses
  const courses = useCourses(programId)

  // grade/year levels
  const gradeYearLevels = useGradeYearLevels(courseId)

  // sections
  const sections = useSections(gradeYearLevelId)

  // subjects
  const subjects = useSubjects(courseId)

  // teachers by program
  const teachers = useTeachersByProgram(programId)

  // students by course & grade level
  const students = useStudents(courseId, gradeYearLevelId, sectionId)

  const action = useAction(createSchoolClass, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<SchoolClassInputs> = (errors) => {
    console.error(`Class Fields Errors: `, errors)
  }

  const onSubmit: SubmitHandler<SchoolClassInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.schoolClass) {
      toast.success(`Class saved!`)

      form.reset()

      window.location.href = `/school-years/${schoolYear.id}/semesters/${result.data.schoolClass.semesterId}`
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="py-2">
        <div className="mb-4 flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            asChild
          >
            <Link
              href={{
                pathname: `/school-years/${schoolYear.id}`,
                query: { program: schoolYear.programOfferingId },
              }}
            >
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Add New Class</h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/courses`}>Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Save Class
            </SubmitButton>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          <fieldset
            disabled={action.isPending}
            className="bg-accent/40 space-y-3 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
          >
            <p className="font-medium">Class Details</p>

            <FormField
              control={form.control}
              name="programOfferingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={schoolYear.programOfferingId}>
                        {schoolYear.programOffering.title}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The program to which this class belongs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolYearId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School/Academic Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={schoolYear.id}>
                        S.Y. {schoolYear.title}
                      </SelectItem>
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schoolYear.semesters.map((sem) => (
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
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e)

                      form.setValue("gradeYearLevelId", "")
                      form.setValue("sectionId", "")
                      form.setValue("subjectId", "")

                      form.setValue("studentIds", [])
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.data?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code}
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
                    onValueChange={(e) => {
                      field.onChange(e)
                      form.setValue("sectionId", "")
                      form.setValue("studentIds", [])
                    }}
                    defaultValue={field.value}
                    disabled={!courseId}
                    key={courseId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade/year level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeYearLevels.data?.map((gy) => (
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

            <FormField
              control={form.control}
              name="sectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!gradeYearLevelId}
                    key={gradeYearLevelId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sections.data?.map((section) => (
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
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <AppCombobox
                    label="Select a subject"
                    inputPlaceholder="Search subject..."
                    disabled={!courseId}
                    key={courseId}
                    value={field.value}
                    onValueChange={field.onChange}
                    options={
                      subjects.data?.map((subject) => ({
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
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <AppCombobox
                    label="Select a teacher"
                    inputPlaceholder="Search teacher..."
                    value={field.value}
                    onValueChange={field.onChange}
                    options={
                      teachers.data?.map((teacher) => ({
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
            {gradingPeriodFields.fields.map((gp, fieldIndex) => (
              <div key={gp.id}>
                <input
                  type="number"
                  hidden
                  defaultValue={fieldIndex + 1} // consider the current grading periods later
                  {...form.register(`gradingPeriods.${fieldIndex}.order`, {
                    valueAsNumber: true,
                  })}
                />
                <FormField
                  control={form.control}
                  name={`gradingPeriods.${fieldIndex}.title`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel
                        className={fieldIndex === 0 ? "mb-2" : "sr-only"}
                      >
                        Grading Periods
                      </FormLabel>
                      {fieldIndex === 0 ? (
                        <FormDescription className="mb-2">
                          You can edit these values.
                        </FormDescription>
                      ) : null}
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder={`Grading Period ${fieldIndex + 1}`}
                            {...field}
                          />
                        </FormControl>
                        {gradingPeriodFields.fields.length === 1 ? null : (
                          <Button
                            type="button"
                            size="iconXXs"
                            variant="ghost"
                            aria-label="Remove"
                            className="absolute right-1 top-1/2 -translate-y-1/2 hover:border"
                            onClick={() =>
                              gradingPeriodFields.remove(fieldIndex)
                            }
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
                  const isValidSoFar = await form.trigger("gradingPeriods", {
                    shouldFocus: true,
                  })

                  if (!isValidSoFar) return

                  gradingPeriodFields.append(
                    {
                      title: "",
                      order: form.watch("gradingPeriods").length + 1,
                    },
                    { shouldFocus: true }
                  )
                }}
                disabled={action.isPending}
              >
                <PlusIcon /> Add
              </Button>
            </div>
          </fieldset>
          <fieldset
            disabled={action.isPending}
            className="bg-accent/40 relative col-span-2 rounded-lg border p-6 disabled:cursor-wait disabled:opacity-90"
          >
            <p className="font-medium">Students</p>
            <p className="text-muted-foreground mb-4 text-sm">
              {form.watch("studentIds").length
                ? `Selected ${form.watch("studentIds").length} students.`
                : `Select students to enroll to this class.`}
            </p>

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
                  <StudentsPicker
                    isLoading={students.isLoading}
                    students={students.data ?? []}
                  />
                </FormItem>
              )}
            />
          </fieldset>
        </div>
      </form>
    </Form>
  )
}
