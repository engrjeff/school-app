import * as z from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string({ required_error: 'Store name is required.' })
    .min(1, { message: 'Store name is required.' }),
  description: z
    .string({ required_error: 'Description is required.' })
    .min(1, { message: 'Description is required.' }),
  address: z
    .string({ required_error: 'Address is required.' })
    .min(1, { message: 'Address is required.' }),
  logoUrl: z.string().url({ message: 'Invalid url for logo.' }).optional(),
});

export type CreateStoreInputs = z.infer<typeof createStoreSchema>;
