"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Student } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { site } from "@/config/site"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"

import { loginStudent } from "./action"

function getFullName(student: Student) {
  return [
    student.firstName,
    student.middleName,
    student.lastName,
    student.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}

function StudentEntryForm() {
  const router = useRouter()

  const action = useAction(loginStudent, {
    onError: (e) => {
      toast.error(e.error.serverError ?? "An unknown error occurred.")
    },
    onSuccess({ data }) {
      if (data) {
        toast.success(`Welcome ${getFullName(data)}!`)
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const studentNumber = e.currentTarget.studentNumber.value

    if (!studentNumber) return

    const result = await action.executeAsync({ studentNumber })

    if (result?.data?.id) {
      router.push(`/student-portal/${result?.data?.id}`)
    }
  }

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">
        Login to {site.title} as Student
      </h1>
      <p className="text-muted-foreground pb-5 text-sm">
        Enter your student number (LRN) to continue.
      </p>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={action.isPending} className="disabled:opacity-90">
          <div className="space-y-2">
            <Label htmlFor="studentNumber">Student Number</Label>
            <Input
              autoFocus
              placeholder="Student number"
              id="studentNumber"
              className="dark:bg-muted/30 h-12"
              required
            />
          </div>

          <div className="pt-6">
            <SubmitButton
              size="lg"
              className="w-full"
              loading={action.isPending}
            >
              Sign In
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export default StudentEntryForm
