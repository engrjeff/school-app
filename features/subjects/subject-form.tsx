"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CirclePlus } from "lucide-react"
import { useForm } from "react-hook-form"

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"

import { SubjectInputs, subjectSchema } from "./schema"

export function SubjectFormDialog({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CirclePlus /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course Subject</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <SubjectForm courseId={courseId} />
      </DialogContent>
    </Dialog>
  )
}

function SubjectForm({ courseId }: { courseId: string }) {
  const form = useForm<SubjectInputs>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      courseId,
      title: "",
      code: "",
      units: 1,
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form>
        <fieldset>
          <input
            type="text"
            hidden
            defaultValue={courseId}
            {...form.register("courseId")}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="English 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ENG1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="units"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Units{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0.0"
                      min={0}
                      {...form.register("units", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-muted-foreground text-xs italic">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <SubmitButton type="submit">Save</SubmitButton>
          </DialogFooter>
        </fieldset>
      </form>
    </Form>
  )
}
