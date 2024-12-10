'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useStoreId } from '../store/hooks';
import { ProductDeleteDialog } from './product-delete-dialog';

type RowAction = 'copy' | 'low-stock' | 'delete' | 'edit';

export function ProductRowActions({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [action, setAction] = useState<RowAction>();

  const storeId = useStoreId();

  return (
    <>
      <div className="flex items-center justify-center">
        <Button size="sm" variant="link" className="text-blue-500">
          Edit
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:border hover:bg-muted/30"
            >
              <span className="sr-only">Actions</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/${storeId}/products/create?copyId=${productId}`}
                target="_blank"
              >
                Copy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAction('low-stock')}>
              Low Stock Reminder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction('delete')}
              className="text-red-500 focus:text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductDeleteDialog
        productId={productId}
        productName={productName}
        open={action === 'delete'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
