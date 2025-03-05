"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { School, Teacher } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { registerSchoolTeacher } from "./action"
import { registerSchema, TeacherSignUpInputs } from "./schema"

function constructTeacherName(teacher: Teacher) {
  return [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
    teacher.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}

export function TeacherSignUpForm({
  teacher,
}: {
  teacher: Teacher & { school: School }
}) {
  const form = useForm<TeacherSignUpInputs>({
    defaultValues: {
      schoolId: teacher.schoolId,
      teacherId: teacher.id,
      teacherEmployeeId: teacher.teacherId,
      name: constructTeacherName(teacher),
      email: teacher.email ?? "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  })

  const action = useAction(registerSchoolTeacher, {
    onError: (e) => {
      console.log(e.error)
      toast.error(e.error.serverError ?? "An unknown error occurred.")
    },
    onSuccess: () => {
      toast.success("Your account has been created successfully.")
    },
  })

  const onError: SubmitErrorHandler<TeacherSignUpInputs> = (errors) => {
    console.error("Teacher Sign Up Errors: ", errors)
  }

  const onSubmit: SubmitHandler<TeacherSignUpInputs> = async (data) => {
    const result = await action.executeAsync({
      ...data,
      teacherEmployeeId: teacher.teacherId,
      teacherId: teacher.id,
      schoolId: teacher.schoolId,
    })

    if (result?.data?.data) {
      toast.success("Your account has been created successfully.")
    }
  }

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Create a Teacher&apos;s account</h1>
      <p className="text-muted-foreground pb-5 text-sm">
        {"Already have an account? "}
        <Link href="/" className="font-medium text-blue-500 hover:underline">
          Log in
        </Link>
        .
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset className="space-y-2" disabled={action.isPending}>
            <input
              type="text"
              hidden
              className="sr-only"
              defaultValue={teacher.schoolId}
              {...form.register("schoolId")}
            />
            <input
              type="text"
              hidden
              className="sr-only"
              defaultValue={teacher.id}
              {...form.register("teacherId")}
            />
            <div className="space-y-2">
              <Label>School</Label>
              <Input
                placeholder="School"
                id="school"
                className="dark:bg-muted/30 h-12"
                disabled
                defaultValue={teacher.school.name}
              />
              <FormMessage />
            </div>
            <FormField
              control={form.control}
              name="teacherEmployeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Employee ID"
                      id="teacherEmployeeId"
                      className="dark:bg-muted/30 h-12"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Enter your name"
                      id="name"
                      className="dark:bg-muted/30 h-12"
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
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="youremail@example.com"
                      id="email"
                      disabled
                      className="dark:bg-muted/30 h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
                      className="dark:bg-muted/30 h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6">
              <SubmitButton
                size="lg"
                loading={action.isPending}
                className="w-full"
              >
                Create Account
              </SubmitButton>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
