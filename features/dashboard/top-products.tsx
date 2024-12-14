import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { ArrowRightIcon, ImagePlusIcon } from 'lucide-react';
import Link from 'next/link';

export function TopProducts() {
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
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Sales</TableHead>
            <TableHead aria-hidden="true"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <TableRow key={`top-product-${n + 1}`}>
              <TableHead className="w-9 text-center">{n}</TableHead>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="size-11 relative rounded border bg-muted/30 text-muted-foreground flex items-center justify-center">
                    <ImagePlusIcon size={16} />
                  </div>
                  <Link
                    href="#"
                    className="hover:text-blue-500 hover:underline"
                  >
                    Product Name {n} here
                  </Link>
                </div>{' '}
              </TableCell>
              <TableCell>Food</TableCell>
              <TableCell className="text-right">120</TableCell>
              <TableCell className="text-right">
                {formatCurrency(1300)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
