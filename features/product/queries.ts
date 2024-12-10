'use server';

import prisma from '@/lib/db';
import { generateSku } from './helpers';
import { CreateProductInputs } from './schema';

export const getProducts = async (storeId: string) => {
  const products = await prisma.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: { select: { name: true } },
      variants: { select: { stock: true, price: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products;
};

export const getProductToCopyById = async (
  productId?: string
): Promise<CreateProductInputs | undefined> => {
  if (!productId) return undefined;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      attributes: {
        include: {
          values: { select: { value: true } },
        },
      },
      variants: {
        include: {
          productAttributeValues: {
            include: {
              attributeValue: true,
              productVariant: true,
            },
          },
        },
      },
    },
  });

  if (!product) return undefined;

  const copyName = product.name + '-COPY';

  if (!product.attributes?.length) {
    return {
      mode: 'copy',
      name: copyName,
      description: product.description ?? undefined,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? undefined,
      meta: {
        type: 'sku-only',
        skuObject: {
          sku: generateSku(copyName),
          price: product.variants.at(0)?.price ?? 0,
          costPrice: product.variants.at(0)?.costPrice ?? 0,
          stock: product.variants.at(0)?.stock ?? 0,
          lowStockThreshold: product.variants.at(0)?.lowStockThreshold ?? 0,
        },
      },
    };
  }

  return {
    mode: 'copy',
    name: copyName,
    description: product.description ?? undefined,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl ?? undefined,
    meta: {
      type: 'with-variants',
      attributes: product.attributes.map((attr) => ({
        name: attr.name,
        options: attr.values,
      })),
      variants: product.variants.map((variant) => {
        return {
          attr1: '',
          attr2: '',
          sku: generateSku(variant.sku, 'COPY'),
          price: variant.price,
          costPrice: variant.costPrice,
          stock: variant.stock,
          lowStockThreshold: variant.lowStockThreshold ?? 0,
          imageUrl: variant.imageUrl ?? undefined,
        };
      }),
    },
  };
};
