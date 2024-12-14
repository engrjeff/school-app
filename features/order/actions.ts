'use server';

import prisma from '@/lib/db';
import { authActionClient } from '@/lib/safe-action';

import { revalidatePath } from 'next/cache';
import { orderSchema, withStoreId } from './schema';

export const createOrder = authActionClient
  .metadata({ actionName: 'createOrder' })
  .schema(withStoreId.merge(orderSchema))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const order = await prisma.order.create({
      data: {
        orderId: parsedInput.orderId,
        orderDate: new Date(parsedInput.orderDate),
        orderStatus: parsedInput.orderStatus,
        paymentStatus: parsedInput.paymentStatus,
        customerName: parsedInput.customerName,
        discountId:
          parsedInput.discountId === '' ? null : parsedInput.discountId,
        paymentMethod: parsedInput.paymentMethod,
        totalAmount: parsedInput.totalAmount,
        regularAmount: parsedInput.regularAmount,
        shippingFee: parsedInput.shippingFee,
        serviceCharge: parsedInput.serviceCharge,
        storeId: parsedInput.storeId,
        createdById: 'cm4lh7mux0000kmj0dmcvm15u', // employee!
        lineItems: {
          create: parsedInput.lineItems.map((line) => ({
            productVariantId: line.productVariantId,
            productName: line.productName,
            sku: line.sku,
            qty: line.qty,
            unitPrice: line.unitPrice,
            attributes: {
              create: line.attributes,
            },
          })),
        },
      },
      select: {
        id: true,
      },
    });

    // also update the stock of variants
    await prisma.$transaction(
      parsedInput.lineItems.map((variant) => {
        return prisma.productVariant.update({
          where: {
            id: variant.productVariantId,
          },
          data: {
            stock: {
              decrement: variant.qty,
            },
          },
        });
      })
    );

    revalidatePath(`/${parsedInput.storeId}/orders`);

    return {
      order,
    };
  });
