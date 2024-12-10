import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImagePlusIcon, InboxIcon } from 'lucide-react';
import Link from 'next/link';
import { ProductRowActions } from './product-row-actions';
import { getProducts } from './queries';

function getTotalStock(stockArray: number[]) {
  const stockTotal = stockArray.reduce((sum, item) => sum + item, 0);

  if (stockTotal === 0)
    return <span className="text-red-500">Out of Stock</span>;

  return <span>{stockTotal} in stock</span>;
}

function getPriceRange(prices: number[]) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) return `₱ ${min.toFixed(2)}`;

  return `₱ ${min.toFixed(2)} - ₱ ${max.toFixed(2)}`;
}

export async function ProductList({ storeId }: { storeId: string }) {
  const products = await getProducts(storeId);

  if (!products.length)
    return (
      <div className="rounded-lg border border-dashed flex-1 flex flex-col items-center justify-center">
        <InboxIcon size={64} strokeWidth={1} />
        <p className="text-sm text-center text-muted-foreground">
          You have no products listed yet.
        </p>
      </div>
    );

  return (
    <Table containerClass="border rounded-lg flex-none">
      <TableHeader>
        <TableRow className="bg-muted/30">
          <TableHead className="w-9 text-center">
            <Checkbox className="data-[state=checked]:bg-blue-500 border-secondary data-[state=checked]:text-white data-[state=checked]:border-blue-500" />
          </TableHead>
          <TableHead className="w-9 text-center">#</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={`product-row-${product.id}`}>
            <TableHead className="w-9 text-center">
              <Checkbox className="data-[state=checked]:bg-blue-500 border-secondary data-[state=checked]:text-white data-[state=checked]:border-blue-500" />
            </TableHead>
            <TableCell className="w-9 text-center">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="size-11 relative rounded border bg-muted/30 text-muted-foreground flex items-center justify-center">
                  <ImagePlusIcon size={16} />
                </div>
                <Link href="#" className="hover:text-blue-500 hover:underline">
                  {product.name}
                </Link>
              </div>{' '}
            </TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell>
              {getTotalStock(product.variants.map((v) => v.stock))}
            </TableCell>
            <TableCell>
              {getPriceRange(product.variants.map((v) => v.price))}
            </TableCell>
            <TableCell className="text-center">
              <ProductRowActions
                productId={product.id}
                productName={product.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
