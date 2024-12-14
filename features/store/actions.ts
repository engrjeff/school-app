'use server';

import prisma from '@/lib/db';
import { authActionClient } from '@/lib/safe-action';

import { revalidatePath } from 'next/cache';
import {
  createStoreSchema,
  discountSchema,
  setGoalsSchema,
  updateStoreSchema,
} from './schema';

export const createStore = authActionClient
  .metadata({ actionName: 'createStore' })
  .schema(createStoreSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const store = await prisma.store.create({
      data: {
        ...parsedInput,
        ownerId: user.userId,
      },
      select: {
        id: true,
      },
    });

    return {
      store,
    };
  });

export const updateStore = authActionClient
  .metadata({ actionName: 'updateStore' })
  .schema(updateStoreSchema)
  .action(async ({ parsedInput: { id, ...data }, ctx: { user } }) => {
    const store = await prisma.store.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
      },
    });

    revalidatePath('/', 'layout');

    return {
      store,
    };
  });

export const setStoreGoals = authActionClient
  .metadata({ actionName: 'setStoreGoals' })
  .schema(setGoalsSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const store = await prisma.store.update({
      where: {
        id: parsedInput.storeId,
      },
      data: {
        salesGoalValue: parsedInput.salesGoalValue,
        ordersGoalValue: parsedInput.ordersGoalValue,
      },
      select: {
        id: true,
      },
    });

    revalidatePath(`/${store.id}/settings`);

    return {
      store,
    };
  });

export const createDiscount = authActionClient
  .metadata({ actionName: 'createDiscount' })
  .schema(discountSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const discount = await prisma.discount.create({
      data: parsedInput,
      select: {
        id: true,
      },
    });

    revalidatePath(`/${parsedInput.storeId}/settings`);

    return {
      discount,
    };
  });
