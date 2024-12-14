import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { OrdersChart } from '@/features/dashboard/orders-chart';
import { TopProducts } from '@/features/dashboard/top-products';
import { formatCurrency } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import {
  BadgePercentIcon,
  ShoppingBagIcon,
  StoreIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="container max-w-6xl space-y-6">
      {/* greetings */}
      <div>
        <h1 className="font-semibold">Good day, {user?.firstName}.</h1>
        <p className="text-sm text-muted-foreground">
          {"Here's what's happening with your store today."}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-primary border-none">
          <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
            <CardDescription className="font-medium text-white">
              Best Seller
            </CardDescription>
            <TrendingUpIcon size={20} className="size-5 text-white" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold mb-1">Spanish Latte Cold/12oz</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className="text-white font-medium">72 orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/80 border-neutral-800">
          <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
            <CardDescription className="font-medium">
              Store Sales
            </CardDescription>
            <StoreIcon size={20} className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold mb-1">{formatCurrency(1200.75)}</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className="text-muted-foreground font-medium">120 orders</p>
              <div className="text-green-500 inline-flex items-center gap-1">
                <TrendingUpIcon size={16} className="size-4" /> <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/80 border-neutral-800">
          <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
            <CardDescription className="font-medium">
              All-time Orders
            </CardDescription>
            <ShoppingBagIcon
              size={20}
              className="size-5 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold mb-1">{2000}</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className="text-muted-foreground font-medium">130 today</p>
              <div className="text-red-500 inline-flex items-center gap-1">
                <TrendingDownIcon size={16} className="size-4" />{' '}
                <span>12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/80 border-neutral-800">
          <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
            <CardDescription className="font-medium">Discounts</CardDescription>
            <BadgePercentIcon
              size={20}
              className="size-5 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold mb-1">{formatCurrency(340.55)}</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className="text-muted-foreground font-medium">20 orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* orders chart */}
      <OrdersChart />

      {/* top products */}
      <TopProducts />
    </div>
  );
}
