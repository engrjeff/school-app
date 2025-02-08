"use client"

import { useId } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { COMMON_PROGRAM_OFFERINGS } from "@/config/constants"
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

import { createCurriculumPrograms } from "./action"
import { CommonProgramsInput, commonProgramsSchema } from "./schema"

type ProgramOfferingType = (typeof COMMON_PROGRAM_OFFERINGS)[number]

type ProgramOffering = Omit<ProgramOfferingType, "courses">

export function ProgramSelectionForm() {
  const form = useForm<CommonProgramsInput>({
    defaultValues: { programs: [] },
    resolver: zodResolver(commonProgramsSchema),
  })

  const action = useAction(createCurriculumPrograms, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  async function onSubmit(values: CommonProgramsInput) {
    const result = await action.executeAsync(values)

    if (result?.data?.createdPrograms) {
      toast.success("Courses were successfully saved!")
      window.location.href = "/program-offerings"
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={action.isPending} className="disabled:cursor-wait">
          <FormField
            control={form.control}
            name="programs"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Programs</FormLabel>
                <FormControl>
                  <ProgramOfferingSelector
                    values={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <p className="text-muted-foreground mt-4 text-sm">
            Note: if your school college programs, you can add those later.
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

function ProgramOfferingSelector({
  values,
  onChange,
}: {
  values: ProgramOffering[]
  onChange: (values: ProgramOffering[]) => void
}) {
  function handleSelectChange(program: ProgramOffering, checked: boolean) {
    if (checked === false) {
      onChange(values.filter((v) => v.title !== program.title))
    } else {
      onChange([...values, program].sort((a, b) => a.id - b.id))
    }
  }

  return (
    <div className="space-y-4">
      {COMMON_PROGRAM_OFFERINGS.map((program) => (
        <ProgramOfferingCheckbox
          key={program.title}
          program={program}
          selected={
            values.find((v) => v.title === program.title) ? true : false
          }
          onSelect={(checked) => handleSelectChange(program, checked)}
        />
      ))}
    </div>
  )
}

function ProgramOfferingCheckbox({
  program,
  selected,
  onSelect,
}: {
  program: ProgramOffering
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
        <Label htmlFor={id}>{program.title}</Label>
        <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {program.description}
        </p>
      </div>
    </div>
  )
}
