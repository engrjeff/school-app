'use server';

import prisma from '@/lib/db';
import { authActionClient } from '@/lib/safe-action';

import { createStoreSchema } from './schema';

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
