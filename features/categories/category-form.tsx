"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircleIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { SubmitButton } from "@/components/ui/submit-button"

import { useStoreId } from "../store/hooks"
import { createCategory } from "./actions"
import { CategoryInputs, categorySchema } from "./schema"

export function CategoryForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>
        <CategoryFormComponent onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function CategoryFormComponent({ onAfterSave }: { onAfterSave: () => void }) {
  const storeId = useStoreId()

  const form = useForm<CategoryInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      storeId,
      name: "",
    },
  })

  const action = useAction(createCategory, {
    onError: ({ error }) => {
      if (error.serverError === "Cannot have products with the same name.") {
        form.setFocus("name")

        form.setError("name", { message: "This already exists." })

        return
      }
      toast.error(
        error.serverError ?? "The category was not created. Please try again."
      )
    },
  })

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: CategoryInputs) {
    const result = await action.executeAsync(values)

    if (result?.data?.category?.id) {
      toast.success("Category saved!")

      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} autoComplete="off">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="Untitled category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={action.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton type="submit" loading={action.isPending}>
            Create
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
