'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { StoreForm } from './store-form';

export function StoreFormDialog({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      {defaultOpen ? null : (
        <DialogTrigger asChild>
          <Button className="gap-2 p-2 w-full justify-start" variant="ghost">
            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus className="size-4" />
            </div>
            <div className="font-medium text-muted-foreground">Add Store</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        hideCloseBtn
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
  );
}
