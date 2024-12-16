"use server"

import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { getSkip } from "@/lib/utils"

import { generateSku } from "./helpers"
import { CreateProductInputs } from "./schema"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export type GetProductsArgs = {
  storeId: string
  categoryId?: string
  q?: string
  page?: number
  pageSize?: number
}

export const getProducts = async (args: GetProductsArgs) => {
  const whereInput: Prisma.ProductWhereInput = {
    storeId: args.storeId,
    categoryId: args.categoryId,
    name: {
      contains: args.q,
      mode: "insensitive",
    },
  }

  const totalFiltered = await prisma.product.count({
    where: whereInput,
  })

  const products = await prisma.product.findMany({
    where: whereInput,
    include: {
      category: { select: { name: true } },
      variants: { select: { stock: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: products.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { products, pageInfo }
}

export const getProductToCopyById = async (
  productId?: string
): Promise<CreateProductInputs | undefined> => {
  if (!productId) return undefined

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
  })

  if (!product) return undefined

  const copyName = product.name + "-COPY"

  if (!product.attributes?.length) {
    return {
      mode: "copy",
      name: copyName,
      description: product.description ?? undefined,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl ?? undefined,
      meta: {
        type: "sku-only",
        skuObject: {
          sku: generateSku(copyName),
          price: product.variants.at(0)?.price ?? 0,
          costPrice: product.variants.at(0)?.costPrice ?? 0,
          stock: product.variants.at(0)?.stock ?? 0,
          lowStockThreshold: product.variants.at(0)?.lowStockThreshold ?? 0,
        },
      },
    }
  }

  return {
    mode: "copy",
    name: copyName,
    description: product.description ?? undefined,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl ?? undefined,
    meta: {
      type: "with-variants",
      attributes: product.attributes.map((attr) => ({
        name: attr.name,
        options: attr.values,
      })),
      variants: product.variants.map((variant) => {
        return {
          attr1: "",
          attr2: "",
          sku: generateSku(variant.sku, "COPY"),
          price: variant.price,
          costPrice: variant.costPrice,
          stock: variant.stock,
          lowStockThreshold: variant.lowStockThreshold ?? 0,
          imageUrl: variant.imageUrl ?? undefined,
        }
      }),
    },
  }
}
