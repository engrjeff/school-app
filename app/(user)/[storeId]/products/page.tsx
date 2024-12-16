import { buttonVariants } from '@/components/ui/button';
import { ProductList } from '@/features/product/product-list';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products',
};

function ProductsPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Products</h1>
          <p className="text-muted-foreground text-sm">
            View, create, and manage your products.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href={`/${params.storeId}/products/create`}
            className={cn(buttonVariants({ size: 'sm' }), 'ml-auto')}
          >
            <PlusCircle />
            Add Product
          </Link>
        </div>
      </div>

      <ProductList storeId={params.storeId} />
    </div>
  );
}

export default ProductsPage;
