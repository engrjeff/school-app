"use client"

import { useId } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { SHS_TRACKS } from "@/config/constants"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"

import { createCommonSHSCourses } from "./action"
import { CommonCoursesInput, commonCoursesSchema } from "./schema"

type ProgramCourse = (typeof SHS_TRACKS)[number]["strands"][number]

export function ProgramCoursesSelection() {
  const form = useForm<CommonCoursesInput>({
    defaultValues: {
      courses: [],
    },
    resolver: zodResolver(commonCoursesSchema),
  })

  const action = useAction(createCommonSHSCourses, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  async function onSubmit(values: CommonCoursesInput) {
    const result = await action.executeAsync(values)

    const redirectTo = "/program-offerings"

    if (result?.data?.createdCourses) {
      toast.success("Senior High School tracks were successfully saved!")
      window.location.href = redirectTo
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={action.isPending} className="disabled:cursor-wait">
          <FormField
            control={form.control}
            name="courses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Courses</FormLabel>
                <FormControl>
                  <ProgramCourseSelector
                    values={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <p className="text-muted-foreground mt-4 text-sm">
            Note: If your school has college programs and other courses, you may
            add those later.
          </p>
          <div className="flex justify-between pt-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Set up later</Link>
            </Button>
            <SubmitButton type="submit" loading={action.isPending}>
              Continue
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}

function ProgramCourseSelector({
  values,
  onChange,
}: {
  values: ProgramCourse[]
  onChange: (values: ProgramCourse[]) => void
}) {
  function handleSelectChange(course: ProgramCourse, checked: boolean) {
    if (checked === false) {
      onChange(values.filter((v) => v.title !== course.title))
    } else {
      onChange([...values, course])
    }
  }

  return (
    <ul className="space-y-4">
      {SHS_TRACKS.map((course) => (
        <li className="space-y-2">
          <p className="text-primary text-sm font-medium">{course.track}</p>
          <div className="space-y-2">
            {course.strands.map((item) => (
              <ProgramCourseCheckbox
                key={item.title}
                course={item}
                selected={
                  values.find((v) => v.title === item.title) ? true : false
                }
                onSelect={(checked) => handleSelectChange(item, checked)}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

function ProgramCourseCheckbox({
  course,
  selected,
  onSelect,
}: {
  course: ProgramCourse
  selected: boolean
  onSelect: (checked: boolean) => void
}) {
  const id = useId()
  return (
    <div className="border-input hover:bg-muted/20 has-[[data-state=checked]]:border-ring relative flex w-full items-start gap-2 rounded-lg border p-4 shadow-sm shadow-black/5 ">
      <Checkbox
        id={id}
        className="order-1 after:absolute after:inset-0"
        aria-describedby={`${id}-description`}
        checked={selected}
        onCheckedChange={(checked) => onSelect(checked === true ? true : false)}
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>{course.title}</Label>
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {course.code}
        </p>
      </div>
    </div>
  )
}
