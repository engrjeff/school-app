"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Gender } from "@prisma/client"
import { ArrowLeftIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useCourses } from "@/hooks/use-courses"
import { useGradeYearLevels } from "@/hooks/use-grade-levels"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { createStudent } from "./actions"
import { StudentInputs, studentSchema } from "./schema"

export function StudentForm() {
  const form = useForm<StudentInputs>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      birthdate: "",
      address: "",
      phone: "",
      email: "",
      gender: Gender.MALE,
      currentCourseId: "",
      currentGradeYearLevelId: "",
    },
  })

  const action = useAction(createStudent, {
    onError: ({ error }) => {
      if (error.serverError) {
        if (error.serverError === "Cannot have duplicate student ID or LRN.") {
          form.setError("studentId", { message: error.serverError })
          return
        }

        toast.error(error.serverError)
        return
      }
    },
  })

  const router = useRouter()

  const courses = useCourses()

  const gradeYearLevels = useGradeYearLevels(form.watch("currentCourseId"))

  const onError: SubmitErrorHandler<StudentInputs> = (errors) => {
    console.log(`Add Student Errors: `, errors)
  }

  const onSubmit: SubmitHandler<StudentInputs> = async (values) => {
    const result = await action.executeAsync(values)

    if (result?.data?.student) {
      toast.success("Student saved!")

      form.reset()

      router.replace("/students")
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
            asChild
          >
            <Link href={`/students`}>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Add Student</h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below.
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/students`}>Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={action.isPending}>
              Save Student
            </SubmitButton>
          </div>
        </div>
        <Separator className="my-6" />
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-wait disabled:opacity-90"
        >
          <p className="text-muted-foreground text-xs uppercase">
            Student Details
          </p>
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID (LRN)</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Student ID or LRN" {...field} />
                </FormControl>
                <FormDescription>
                  The Learner&apos;s Reference Number (LRN)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Middle Name{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suffix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Suffix{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Suffix"
                      list="common-suffixes"
                      {...field}
                    />
                  </FormControl>
                  <datalist id="common-suffixes">
                    <option value="Jr"></option>
                    <option value="Sr"></option>
                    <option value="I"></option>
                    <option value="II"></option>
                    <option value="III"></option>
                    <option value="IV"></option>
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      type="tel"
                      inputMode="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-start-1">
                  <FormLabel>
                    Email{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  <Input type="date" className="w-min" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={Gender.MALE} />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={Gender.FEMALE} />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <Separator className="my-6" />
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-wait disabled:opacity-90"
        >
          <p className="text-muted-foreground text-xs uppercase">
            Student Course
          </p>

          <FormField
            control={form.control}
            name="currentCourseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e)
                    form.setValue("currentGradeYearLevelId", "")
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
                <FormDescription>
                  The current course of this student.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentGradeYearLevelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade/Year Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!form.watch("currentCourseId")}
                  key={form.watch("currentCourseId")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade/year level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradeYearLevels.data?.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.displayName} {g.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The current grade/level of this student in the selected
                  course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <Separator className="my-6" />
        <div className="ml-auto flex items-center justify-end space-x-3">
          <Button size="sm" variant="secondary" asChild>
            <Link href={`/students`}>Discard</Link>
          </Button>
          <SubmitButton size="sm" loading={action.isPending}>
            Save Student
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
