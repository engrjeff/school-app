import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ProductForm } from '@/features/product/product-form';
import { getProductToCopyById } from '@/features/product/queries';
import Link from 'next/link';

interface PageProps {
  params: { storeId: string };
  searchParams?: { copyId?: string };
}

async function CreateProductPage({ params, searchParams }: PageProps) {
  const productToCopy = await getProductToCopyById(searchParams?.copyId);

  return (
    <div className="container max-w-4xl relative flex flex-col space-y-6 overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${params.storeId}/dashboard`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${params.storeId}/products`}>Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductForm storeId={params.storeId} initialValues={productToCopy} />
    </div>
  );
}

export default CreateProductPage;
