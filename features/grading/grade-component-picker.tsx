"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { useGradeComponents } from "@/hooks/use-grade-components"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { SubmitButton } from "@/components/ui/submit-button"

import { assignGradeComponents } from "./action"
import {
  GradeComponentPickerInputs,
  gradeComponentPickerSchema,
} from "./schema"

export function GradeComponentPicker() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" className="shrink-0">
          Select Grade Components
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Grade Components</DialogTitle>
          <DialogDescription>
            The total percentage should sum up to a maximum of 100%.
          </DialogDescription>
        </DialogHeader>
        <GradeComponentPickerForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function GradeComponentPickerForm({
  onAfterSave,
}: {
  onAfterSave: VoidFunction
}) {
  const { id: classId } = useParams<{ id: string }>()

  const form = useForm<GradeComponentPickerInputs>({
    resolver: zodResolver(gradeComponentPickerSchema),
    defaultValues: { gradeComponents: [] },
  })

  const action = useAction(assignGradeComponents, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
        return
      }
    },
  })

  const onError: SubmitErrorHandler<GradeComponentPickerInputs> = (errors) => {
    console.log("Assign Grade Components Error: ", errors)
  }

  const onSubmit: SubmitHandler<GradeComponentPickerInputs> = async (
    values
  ) => {
    const result = await action.executeAsync({ classId, ...values })

    if (result?.data?.success) {
      toast.success("Grade components were successfully assigned to the class!")
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-wait"
        >
          <FormField
            control={form.control}
            name="gradeComponents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Grade Components</FormLabel>
                <FormControl>
                  <GradeComponentSelector
                    value={field.value.map((v) => v.id)}
                    onValueChange={(values) =>
                      field.onChange(values.map((v) => ({ id: v })))
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button
                type="button"
                disabled={action.isPending}
                variant="secondaryOutline"
              >
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton type="submit" loading={action.isPending}>
              Save
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}

function GradeComponentSelector({
  value,
  onValueChange,
}: {
  value: string[]
  onValueChange: (value: string[]) => void
}) {
  const gradeComponents = useGradeComponents()

  if (gradeComponents.isLoading)
    return (
      <div className="space-y-2">
        <Skeleton className="h-[70px] rounded-lg" />
        <Skeleton className="h-[70px] rounded-lg" />
        <Skeleton className="h-[70px] rounded-lg" />
      </div>
    )

  const totalPercentage =
    gradeComponents.data?.reduce(
      (sum, i) => (sum += value.includes(i.id) ? i.percentage : 0),
      0
    ) ?? 0

  return (
    <div className="space-y-2">
      <FormDescription>
        Total Percentage: {totalPercentage * 100}%
      </FormDescription>
      {gradeComponents.data?.map((gc) => (
        <div
          key={gc.id}
          className="border-input hover:bg-muted/20 has-[[data-state=checked]]:border-ring relative flex w-full items-start gap-2 rounded-lg border p-4 shadow-sm shadow-black/5 "
        >
          <Checkbox
            id={gc.id}
            className="order-1 after:absolute after:inset-0"
            aria-describedby={`${gc.id}-description`}
            checked={value.includes(gc.id)}
            onCheckedChange={(checked) => {
              if (checked === true) {
                onValueChange([...value, gc.id])
              } else {
                onValueChange(value.filter((v) => v! !== gc.id))
              }
            }}
          />
          <div className="grid grow gap-2">
            <Label htmlFor={gc.id}>
              {gc.label} - {gc.percentage * 100}%
            </Label>
            <p
              id={`${gc.id}-description`}
              className="text-muted-foreground text-xs"
            >
              {gc.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
