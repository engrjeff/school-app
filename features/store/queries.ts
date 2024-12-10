'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/db';

export const getStores = async () => {
  const user = await auth();

  const stores = await prisma.store.findMany({
    where: {
      ownerId: user.userId!,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return stores;
};
