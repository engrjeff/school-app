'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useKPIs } from '@/hooks/use-kpis';
import { formatCurrency } from '@/lib/utils';
import { ArrowRightIcon, ImagePlusIcon } from 'lucide-react';
import Link from 'next/link';

export function TopProducts() {
  const kpiQuery = useKPIs();

  if (kpiQuery.isLoading)
    return (
      <Card>
        <Skeleton className="h-[600px] animate-pulse bg-muted" />
      </Card>
    );

  return (
    <Card className="border rounded-lg bg-muted">
      <CardHeader className="flex-row justify-between">
        <CardTitle>Top Products</CardTitle>
        <Link
          href="#"
          className="text-primary text-sm hover:underline inline-flex gap-2 items-center"
        >
          All Products <ArrowRightIcon size={16} className="size-4" />
        </Link>
      </CardHeader>
      <Table containerClass="flex-none">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-9 w-9 text-center">#</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Sales</TableHead>
            <TableHead aria-hidden="true"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kpiQuery.data?.topProducts?.map((orderItem, index) => (
            <TableRow key={`top-product-${orderItem.id}`}>
              <TableHead className="w-9 text-center">{index + 1}</TableHead>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="size-11 relative rounded border bg-muted/30 text-muted-foreground flex items-center justify-center">
                    <ImagePlusIcon size={16} />
                  </div>
                  <div>
                    <Link
                      href="#"
                      className="hover:text-blue-500 hover:underline"
                    >
                      {orderItem.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {orderItem.attributes.map((a) => a.value).join(', ')}
                    </p>
                  </div>
                </div>{' '}
              </TableCell>
              <TableCell>{orderItem.sku}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(orderItem.unitPrice)}
              </TableCell>
              <TableCell className="text-right">{orderItem.qty}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(orderItem.qty * orderItem.unitPrice)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
