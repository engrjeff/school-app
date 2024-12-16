import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sales',
};

function SalesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div>
        <h1 className="font-semibold">Sales</h1>
        <p className="text-muted-foreground text-sm">
          {"View insights from your store's sales."}
        </p>
      </div>

      <div>Store ID: {params.storeId}</div>
    </div>
  );
}

export default SalesPage;
