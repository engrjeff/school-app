"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CirclePlus, PlusIcon, TrashIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
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
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"

import { createSchoolYear } from "./actions"
import { SchoolYearInputs, schoolYearSchema } from "./schema"

export function SchoolYearFormDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CirclePlus /> Add School Year
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add School Year</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <SchoolYearForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function SchoolYearForm({ onAfterSave }: { onAfterSave: () => void }) {
  const searchParams = useSearchParams()

  const programs = useProgramOfferings()

  const form = useForm<SchoolYearInputs>({
    resolver: zodResolver(schoolYearSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      programOfferingId: searchParams.get("program") ?? "",
      semesters: [{ title: "1st Semester" }],
    },
  })

  const semesterFields = useFieldArray({
    control: form.control,
    name: "semesters",
  })

  const action = useAction(createSchoolYear, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
    },
  })

  const onError: SubmitErrorHandler<SchoolYearInputs> = (errors) => {
    console.log("Create School Year Error: ", errors)
  }

  const onSubmit: SubmitHandler<SchoolYearInputs> = async (values) => {
    const result = await action.executeAsync(values)

    if (result?.data?.schoolYear) {
      toast.success("School year created!")
      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-2">
        <Label>Program</Label>
        <Input
          type="text"
          disabled
          placeholder="Program"
          defaultValue={
            programs.data?.find((p) => p.id === searchParams.get("program"))
              ?.title
          }
        />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-2 disabled:cursor-wait"
        >
          <input
            type="text"
            hidden
            defaultValue={searchParams.get("program") ?? undefined}
            {...form.register("programOfferingId")}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="School Year name" {...field} />
                </FormControl>
                <FormDescription>
                  e.g. {new Date().getFullYear()} -{" "}
                  {new Date().getFullYear() + 1}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Semesters</Label>
            {semesterFields.fields.map((semesterField, i) => (
              <FormField
                key={semesterField.id}
                control={form.control}
                name={`semesters.${i}.title`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel
                        className={
                          i === 0
                            ? "text-muted-foreground text-[11px] uppercase"
                            : "sr-only"
                        }
                      >
                        Name
                      </FormLabel>
                      <FormDescription className={i === 0 ? "" : "sr-only"}>
                        e.g. 1st Semester
                      </FormDescription>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Semester name" {...field} />
                      </FormControl>
                      {semesterFields.fields.length === 1 ? null : (
                        <Button
                          type="button"
                          size="iconXXs"
                          variant="ghost"
                          aria-label="Remove"
                          className="absolute right-1 top-1/2 -translate-y-1/2 hover:border"
                          onClick={() => semesterFields.remove(i)}
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
            ))}
            <Button
              type="button"
              variant="secondaryOutline"
              size="sm"
              className="mt-4"
              onClick={async () => {
                const isValidSoFar = await form.trigger("semesters", {
                  shouldFocus: true,
                })

                if (!isValidSoFar) return

                semesterFields.append({ title: "" })
              }}
            >
              <PlusIcon /> Add
            </Button>
          </div>
          <DialogFooter>
            <SubmitButton type="submit" loading={action.isPending}>
              Save
            </SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
