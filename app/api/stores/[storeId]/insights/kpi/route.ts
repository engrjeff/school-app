import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

export const dynamic = 'force-dynamic';

type Preset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'last_week'
  | 'last_month'
  | 'last_year';

function getDateRange(preset: Preset): { start: Date; end: Date } {
  const now = new Date();

  if (preset === 'last_year') {
    return {
      start: startOfYear(subYears(now, 1)),
      end: endOfYear(subYears(now, 1)),
    };
  }

  if (preset === 'this_week') {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }

  if (preset === 'last_week') {
    return {
      start: subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(now, { weekStartsOn: 1 }), 7),
    };
  }

  if (preset === 'this_month') {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };
  }

  if (preset === 'last_month') {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };
  }

  if (preset === 'this_year') {
    return {
      start: startOfYear(now),
      end: endOfYear(now),
    };
  }

  if (preset === 'yesterday') {
    return {
      start: startOfYesterday(),
      end: endOfYesterday(),
    };
  }

  return {
    start: startOfToday(),
    end: endOfToday(),
  };
}

function calcPercentDiff(v1: number, v2: number) {
  return (Math.abs(v1 - v2) / ((v1 + v2) / 2)) * 100;
}

// get KPIs
// 1. best-selling product
// 2. sales for the day
// 3. orders for this day
// 4. discounts given
export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const range = getDateRange('today');

    const yesterday = getDateRange('yesterday');

    const ordersQuery = prisma.order.findMany({
      where: {
        storeId: params.storeId,
        orderDate: {
          gte: range.start,
          lte: range.end,
        },
      },
      include: {
        discount: true,
        lineItems: {
          include: { attributes: true },
        },
      },
    });

    const yesterdayOrdersQuery = prisma.order.findMany({
      where: {
        storeId: params.storeId,
        orderDate: {
          gte: yesterday.start,
          lte: yesterday.end,
        },
      },
      include: {
        discount: true,
        lineItems: true,
      },
    });

    const [orders, yesterdayOrders] = await Promise.all([
      ordersQuery,
      yesterdayOrdersQuery,
    ]);

    const sales = orders.reduce((subSalesTotal, order) => {
      return subSalesTotal + order.totalAmount;
    }, 0);

    const salesYesterday = yesterdayOrders.reduce((subSalesTotal, order) => {
      return subSalesTotal + order.totalAmount;
    }, 0);

    const ordersWithDiscount = orders.filter((o) => o.discountId);

    const todalDiscount = ordersWithDiscount.reduce(
      (d, order) => d + Number(order.discount?.discountAmount),
      0
    );

    const orderItems = orders
      .map((order) => {
        return order.lineItems;
      })
      .flat();

    orderItems.sort((a, b) => b.qty - a.qty);

    const bestSeller = orderItems.at(0);

    const bestSellerItem = orderItems.filter(
      (o) => o.productVariantId === bestSeller?.productVariantId
    );

    const orderItemsCount = orders.reduce((c, i) => c + i.lineItems.length, 0);

    const yesterdayOrderItemsCount = yesterdayOrders.reduce(
      (c, i) => c + i.lineItems.length,
      0
    );

    const topProductsMap = new Map<string, (typeof orderItems)[number]>();

    orderItems.forEach((item) => {
      if (topProductsMap.has(item.productVariantId)) {
        const thisItemQty = topProductsMap.get(item.productVariantId)?.qty ?? 0;

        topProductsMap.set(item.productVariantId, {
          ...item,
          qty: thisItemQty + item.qty,
        });
      } else {
        topProductsMap.set(item.productVariantId, item);
      }
    });

    const kpiData = {
      sales: {
        today: sales,
        todayFormatted: formatCurrency(sales),
        yesterday: salesYesterday,
        yesterdayFormatted: formatCurrency(salesYesterday),
        percentDiff: calcPercentDiff(sales, salesYesterday),
        trend:
          sales === salesYesterday
            ? 'equal'
            : sales > salesYesterday
              ? 'up'
              : 'down',
      },
      orders: {
        today: orders.length,
        orderItemsCount,
        yesterday: yesterdayOrders.length,
        yesterdayOrderItemsCount,
        percentDiff: calcPercentDiff(orderItemsCount, yesterdayOrderItemsCount),
        trend:
          orderItemsCount === yesterdayOrderItemsCount
            ? 'equal'
            : orderItemsCount > yesterdayOrderItemsCount
              ? 'up'
              : 'down',
      },
      discount: {
        ordersCount: ordersWithDiscount.length,
        total: todalDiscount,
        totalFormatted: formatCurrency(todalDiscount),
      },
      bestSeller: {
        ...bestSeller,
        orderCount: bestSellerItem.reduce((t, i) => t + i.qty, 0),
      },
      topProducts: Array.from(topProductsMap.values()).slice(0, 8), // first 8 only
    };

    return NextResponse.json(kpiData);
  } catch (error) {
    console.log('Get KPIs Error: ', error);

    return NextResponse.json({});
  }
}
