"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { StoreForm } from "./store-form"

export function StoreFormDialog({
  defaultOpen,
  isModal,
}: {
  defaultOpen?: boolean
  isModal?: boolean
}) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      {defaultOpen ? null : (
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2 p-2" variant="ghost">
            <div className="bg-background flex size-6 items-center justify-center rounded-md border">
              <Plus className="size-4" />
            </div>
            <div className="text-muted-foreground font-medium">Add Store</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        hideCloseBtn={!isModal}
        className="max-w-3xl"
        onInteractOutside={defaultOpen ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create Store</DialogTitle>
          <DialogDescription>Start by adding ypur store.</DialogDescription>
        </DialogHeader>
        <StoreForm />
      </DialogContent>
    </Dialog>
  )
}
