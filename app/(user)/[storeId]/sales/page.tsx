import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales',
};

function SalesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container max-w-5xl flex flex-col gap-6 flex-1">
      <div>
        <h1 className="font-semibold">Sales</h1>
        <p className="text-sm text-muted-foreground">
          {"View insights from your store's sales."}
        </p>
      </div>

      <div>Store ID: {params.storeId}</div>
    </div>
  );
}

export default SalesPage;
