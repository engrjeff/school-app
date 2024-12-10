import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import * as z from 'zod';

import { auth } from '@clerk/nextjs/server';

class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action error:', e.message);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        if (
          e.message.includes(
            'Unique constraint failed on the fields: (`ownerId`,`name`)'
          )
        ) {
          return 'The store name you provided already exists.';
        }
        if (
          e.message.includes(
            'Unique constraint failed on the fields: (`storeId`,`name`)'
          )
        ) {
          return 'Cannot have products with the same name.';
        }
        if (
          e.message.includes(
            'Unique constraint failed on the fields: (`storeId`,`sku`)'
          )
        ) {
          return 'Cannot have duplicate SKUs for the same store.';
        }
      }
    }

    if (e instanceof ActionError) {
      return e.message;
    }

    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  // Define logging middleware.
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await auth();

  if (!user?.userId) throw new Error('Session not found.');

  return next({ ctx: { user } });
});
