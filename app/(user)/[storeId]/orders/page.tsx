import { SearchField } from '@/components/ui/search-field';
import { OrdersDateRangeFilter } from '@/features/order/orders-date-range-filter';
import { OrderStatusFilter } from '@/features/order/orders-status-filter';
import { OrdersTable } from '@/features/order/orders-table';
import { PaymentStatusFilter } from '@/features/order/payment-status-filter';
import { getOrders } from '@/features/order/queries';
import { POSAside } from '@/features/pos/pos-aside';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
};

async function OrdersPage({ params }: { params: { storeId: string } }) {
  const orders = await getOrders(params.storeId);

  return (
    <div className="container max-w-5xl flex flex-col gap-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {"View, create, and manage your store's orders."}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <POSAside />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <SearchField
          className="w-[300px] bg-muted/30"
          placeholder="Search orders"
        />
        <div className="flex items-center justify-end gap-2">
          <OrdersDateRangeFilter />
          <OrderStatusFilter />
          <PaymentStatusFilter />
        </div>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}

export default OrdersPage;
