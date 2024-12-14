'use server';

import prisma from '@/lib/db';

export const getOrders = async (storeId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      storeId,
    },
    include: {
      lineItems: {
        include: { attributes: true },
      },
      discount: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type OrdersWithLineItems = ThenArg<ReturnType<typeof getOrders>>;
