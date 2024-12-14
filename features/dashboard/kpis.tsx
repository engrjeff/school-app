'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  BadgePercentIcon,
  EqualIcon,
  ShoppingBagIcon,
  StoreIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useKPIs } from '@/hooks/use-kpis';

export function KPIs() {
  const kpiQuery = useKPIs();

  if (kpiQuery.isLoading)
    return (
      <div className="grid grid-cols-4 gap-6">
        <Skeleton className="h-[134px] border rounded-xl bg-muted text-card-foreground shadow animate-pulse" />
        <Skeleton className="h-[134px] border rounded-xl bg-muted text-card-foreground shadow animate-pulse" />
        <Skeleton className="h-[134px] border rounded-xl bg-muted text-card-foreground shadow animate-pulse" />
        <Skeleton className="h-[134px] border rounded-xl bg-muted text-card-foreground shadow animate-pulse" />
      </div>
    );

  return (
    <div className="grid grid-cols-4 gap-6">
      <Card className="bg-muted border-l-4 border-l-primary">
        <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
          <CardDescription className="font-medium text-white">
            Best Seller
          </CardDescription>
          <TrendingUpIcon size={20} className="size-5 text-white" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold mb-1">
            {kpiQuery.data?.bestSeller.productName}
          </p>
          <div className="text-sm flex items-center gap-1.5">
            <p className="font-medium text-muted-foreground">
              {kpiQuery.data?.bestSeller.orderCount}{' '}
              {Number(kpiQuery.data?.bestSeller.orderCount) > 1
                ? 'items sold'
                : 'item sold'}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/80 border-neutral-800">
        <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
          <CardDescription className="font-medium">Daily Sales</CardDescription>
          <StoreIcon size={20} className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold mb-1">
            {kpiQuery.data?.sales.todayFormatted}
          </p>
          <div className="text-sm flex items-center gap-1.5">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.orders.today} orders
            </p>
            <Trend
              trend={kpiQuery.data?.sales.trend}
              value={kpiQuery.data?.sales.percentDiff ?? 0}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/80 border-neutral-800">
        <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
          <CardDescription className="font-medium">
            Items Ordered Today
          </CardDescription>
          <ShoppingBagIcon size={20} className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold mb-1">
            {kpiQuery.data?.orders.orderItemsCount}{' '}
            <span className="text-xs text-muted-foreground font-normal">
              / {kpiQuery.data?.orders.today} orders
            </span>
          </p>
          <div className="text-sm flex items-center gap-1.5">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.orders.yesterdayOrderItemsCount} yesterday
            </p>
            <Trend
              trend={kpiQuery.data?.orders.trend}
              value={kpiQuery.data?.orders.percentDiff ?? 0}
            />
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
          <p className="text-xl font-bold mb-1">
            {kpiQuery.data?.discount.totalFormatted}
          </p>
          <div className="text-sm flex items-center gap-1.5">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.discount.ordersCount}{' '}
              {Number(kpiQuery.data?.discount.ordersCount) > 1
                ? 'orders'
                : 'order'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Trend({ trend, value }: { value: number; trend?: string }) {
  if (trend === 'equal')
    return (
      <div className="text-amber-500 inline-flex items-center gap-1">
        <EqualIcon size={16} className="size-4" />{' '}
        <span>{value.toFixed(1)}%</span>
      </div>
    );

  if (trend === 'up')
    return (
      <div className="text-green-500 inline-flex items-center gap-1">
        <TrendingUpIcon size={16} className="size-4" />{' '}
        <span>{value.toFixed(1)}%</span>
      </div>
    );

  if (trend === 'down')
    return (
      <div className="text-red-500 inline-flex items-center gap-1">
        <TrendingDownIcon size={16} className="size-4" />{' '}
        <span>{value.toFixed(1)}%</span>
      </div>
    );

  return null;
}
