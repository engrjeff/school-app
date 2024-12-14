'use server';

import prisma from '@/lib/db';
import { DateRangePreset, getDateRange } from '@/lib/utils';

export type GetOrdersArgs = {
  storeId: string;
  range?: DateRangePreset;
};

export const getOrders = async (args: GetOrdersArgs) => {
  const range = getDateRange(args.range ?? 'today');

  const orders = await prisma.order.findMany({
    where: {
      storeId: args.storeId,
      orderDate: {
        gte: range.start,
        lte: range.end,
      },
    },
    include: {
      lineItems: {
        include: { attributes: true },
      },
      discount: true,
    },
    orderBy: {
      orderDate: 'desc',
    },
  });

  return orders;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type OrdersWithLineItems = ThenArg<ReturnType<typeof getOrders>>;
