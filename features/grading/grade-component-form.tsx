"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CirclePlusIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { createGradeComponent } from "./action"
import { GradeComponentInputs, gradeComponentSchema } from "./schema"

export function GradeComponentFormDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CirclePlusIcon /> Add Grade Component
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Grade Component</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <GradeComponentForm onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export function GradeComponentForm({
  onAfterSave,
}: {
  onAfterSave: VoidFunction
}) {
  const form = useForm<GradeComponentInputs>({
    resolver: zodResolver(gradeComponentSchema),
    mode: "onChange",
    defaultValues: {
      label: "",
      title: "",
      percentage: 0,
      // parts: [
      //   {
      //     title: "",
      //     order: 1,
      //     highestPossibleScore: 10,
      //   },
      // ],
    },
  })

  const action = useAction(createGradeComponent, {
    onError: ({ error }) =>
      toast.error(error.serverError ?? "An error occurred."),
  })

  const onError: SubmitErrorHandler<GradeComponentInputs> = (errors) => {
    console.log(`Grade Component Create Errors: `, errors)
  }

  const onSubmit: SubmitHandler<GradeComponentInputs> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.gradeComponent) {
      toast.success(`Grade component saved!`)

      form.reset()

      onAfterSave()
    }
  }

  // function generateSubComponents() {
  //   form.clearErrors("parts")

  //   if (!form.getValues("title")) return

  //   const generatedParts = Array.from(Array(10).keys()).map((n) => ({
  //     order: n + 1,
  //     title:
  //       form
  //         .getValues("title")
  //         .split(" ")
  //         .map((c) => c.charAt(0).toUpperCase())
  //         .join("") + (n + 1).toString(),
  //     highestPossibleScore: 10,
  //   }))

  //   form.setValue("parts", generatedParts)
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          disabled={action.isPending}
          className="space-y-3 disabled:cursor-not-allowed disabled:opacity-90"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Label" {...field} />
                </FormControl>
                <FormDescription>e.g. Written Works for MATH 1</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>e.g. Written Works</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="percentage"
            render={() => (
              <FormItem className="w-1/4">
                <FormLabel>Percentage (%)</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0.0"
                    min={0}
                    max={1}
                    step="any"
                    {...form.register("percentage", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormDescription>e.g. 0.2 for 20%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="space-y-4">
            <Label>Subcomponents</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="should-generate-parts"
                disabled={!form.getValues("title")}
                onCheckedChange={(checked) => {
                  if (!!checked) {
                    generateSubComponents()
                  }
                }}
              />
              <label
                htmlFor="should-generate-parts"
                className="text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Generate Subcomponents
              </label>
            </div>
            <Table className="table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-9 first:rounded-l-none first:border-l-0 last:rounded-r-none">
                    #
                  </TableHead>
                  <TableHead className="px-0.5 first:rounded-l-none last:rounded-r-none">
                    Name
                  </TableHead>
                  <TableHead className="px-0.5 first:rounded-l-none last:rounded-r-none">
                    Highest Possible Score
                  </TableHead>
                  <TableHead className="first:rounded-l-none last:rounded-r-none last:border-r-0"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partsFields.fields.map((field, fieldIndex) => (
                  <TableRow
                    key={field.id}
                    className="border-b-0 hover:bg-transparent"
                  >
                    <TableCell>
                      <input
                        type="text"
                        hidden
                        defaultValue={fieldIndex + 1}
                        {...form.register(`parts.${fieldIndex}.order`)}
                      />
                      {fieldIndex + 1}
                    </TableCell>
                    <TableCell className="p-0.5 align-top">
                      <FormField
                        control={form.control}
                        name={`parts.${fieldIndex}.title`}
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5 align-top">
                      <FormField
                        control={form.control}
                        name={`parts.${fieldIndex}.highestPossibleScore`}
                        render={() => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">
                              Highest Possible Score
                            </FormLabel>
                            <FormControl>
                              <NumberInput
                                {...form.register(
                                  `parts.${fieldIndex}.highestPossibleScore`,
                                  { valueAsNumber: true }
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0.5 align-top">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Remove"
                        className="hover:border"
                        onClick={() => partsFields.remove(fieldIndex)}
                        tabIndex={-1}
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4}>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondaryOutline"
                      onClick={async () => {
                        const isValidSoFar = await form.trigger("parts")

                        if (!isValidSoFar) return

                        const nextOrder = form.getValues("parts").length + 1

                        partsFields.append({
                          order: nextOrder,
                          highestPossibleScore: 10,
                          title: form.getValues("title")
                            ? form
                                .getValues("title")
                                .split(" ")
                                .map((c) => c.charAt(0).toUpperCase())
                                .join("") + nextOrder.toString()
                            : "",
                        })
                      }}
                    >
                      <PlusIcon /> Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div> */}
        </fieldset>

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="secondaryOutline">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton loading={action.isPending}>Save</SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  )
}
