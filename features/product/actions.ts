"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import {
  productSchema,
  requireProductId,
  updateProductSchema,
  withStoreId,
} from "./schema"

export const createProduct = authActionClient
  .metadata({ actionName: "createProduct" })
  .schema(productSchema.merge(withStoreId))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { type } = parsedInput.meta

    if (type === "sku-only") {
      const product = await prisma.product.create({
        data: {
          ownerId: user.userId,
          storeId: parsedInput.storeId,
          categoryId: parsedInput.categoryId,
          name: parsedInput.name,
          description: parsedInput.description,
          imageUrl: parsedInput.imageUrl,
          variants: {
            create: [
              {
                storeId: parsedInput.storeId,
                sku: parsedInput.meta.skuObject.sku,
                price: parsedInput.meta.skuObject.price,
                costPrice: parsedInput.meta.skuObject.costPrice,
                imageUrl: parsedInput.imageUrl,
                stock: parsedInput.meta.skuObject.stock,
                lowStockThreshold: parsedInput.meta.skuObject.lowStockThreshold,
                order: 1,
              },
            ],
          },
        },
      })

      revalidatePath(`/${parsedInput.storeId}/products`)

      return { product }
    }

    const { attributes, variants } = parsedInput.meta

    const product = await prisma.product.create({
      data: {
        ownerId: user.userId,
        storeId: parsedInput.storeId,
        categoryId: parsedInput.categoryId,
        name: parsedInput.name,
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
        attributes: {
          create: attributes.map((attr) => ({
            name: attr.name,
            values: {
              create: attr.options.map((opt) => ({ value: opt.value })),
            },
          })),
        },
      },
      include: {
        attributes: {
          include: {
            values: true,
          },
        },
      },
    })

    const attr1 = product.attributes.at(0)
    const attr2 = product.attributes.at(1)

    if (attr1 && !attr2) {
      if (variants?.length) {
        const createdVariants = await prisma.productVariant.createMany({
          data: variants?.map((variant, index) => ({
            storeId: parsedInput.storeId,
            productId: product.id,
            sku: variant.sku,
            price: variant.price,
            costPrice: variant.costPrice,
            imageUrl: parsedInput.imageUrl,
            stock: variant.stock ?? 0,
            lowStockThreshold: variant.lowStockThreshold ?? 0,
            order: index + 1,
          })),
        })

        console.log("Created variants: ", createdVariants)
      }
    }

    if (attr1 && attr2) {
      if (variants?.length) {
        const createdVariants = await prisma.$transaction(
          variants.map((variant, index) => {
            return prisma.productVariant.create({
              data: {
                storeId: parsedInput.storeId,
                productId: product.id,
                sku: variant.sku,
                price: variant.price,
                costPrice: variant.costPrice,
                imageUrl: parsedInput.imageUrl,
                stock: variant.stock ?? 0,
                lowStockThreshold: variant.lowStockThreshold ?? 0,
                order: index + 1,

                productAttributeValues: {
                  create: [
                    {
                      attributeValue: {
                        connect: {
                          id: attr1.values.find(
                            (v) => v.value === variant.attr1
                          )?.id,
                        },
                      },
                    },
                    {
                      attributeValue: {
                        connect: {
                          id: attr2.values.find(
                            (v) => v.value === variant.attr2
                          )?.id,
                        },
                      },
                    },
                  ],
                },
              },
            })
          })
        )

        console.log("Created variants: ", createdVariants)
      }
    }

    revalidatePath(`/${parsedInput.storeId}/products`)

    return { product }
  })

export const deleteProduct = authActionClient
  .metadata({ actionName: "deleteProduct" })
  .schema(requireProductId)
  .action(async ({ parsedInput: { id } }) => {
    const foundProduct = await prisma.product.findFirst({
      where: { id },
      select: { id: true, storeId: true },
    })

    if (!foundProduct) throw new Error("Cannot find product.")

    await prisma.product.delete({
      where: {
        id,
      },
    })

    revalidatePath(`/${foundProduct.storeId}/products`)

    return {
      status: "ok",
    }
  })

export const updateProduct = authActionClient
  .metadata({ actionName: "updateProduct" })
  .schema(updateProductSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const foundProduct = await prisma.product.findUnique({
      where: { id: parsedInput.id },
      include: { variants: true },
    })

    if (!foundProduct) throw new Error("Product not found.")

    const { type } = parsedInput.meta

    if (type === "sku-only") {
      const product = await prisma.product.update({
        where: {
          id: parsedInput.id,
        },
        data: {
          ownerId: user.userId,
          storeId: parsedInput.storeId,
          categoryId: parsedInput.categoryId,
          name: parsedInput.name,
          description: parsedInput.description,
          imageUrl: parsedInput.imageUrl,
          variants: {
            update: [
              {
                where: {
                  id: foundProduct.variants[0].id,
                },
                data: parsedInput.meta.skuObject,
              },
            ],
          },
        },
      })

      revalidatePath(`/${foundProduct.storeId}/products/${product.id}`)

      return { product }
    }

    const { attributes, variants } = parsedInput.meta

    const productId = parsedInput.id

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ownerId: user.userId,
        storeId: parsedInput.storeId,
        categoryId: parsedInput.categoryId,
        name: parsedInput.name,
        description: parsedInput.description,
        imageUrl: parsedInput.imageUrl,
        attributes: {
          deleteMany: {},
          create: attributes.map((attr) => ({
            name: attr.name,
            values: {
              create: attr.options.map((opt) => ({ value: opt.value })),
            },
          })),
        },
        variants: {
          deleteMany: {},
        },
      },
      include: {
        attributes: {
          include: {
            values: true,
          },
        },
      },
    })

    const attr1 = product.attributes?.at(0)
    const attr2 = product.attributes?.at(1)

    if (attr1 && !attr2) {
      if (variants?.length) {
        const createdVariants = await prisma.productVariant.createMany({
          data: variants?.map((variant, index) => ({
            storeId: parsedInput.storeId,
            productId,
            sku: variant.sku,
            price: variant.price,
            costPrice: variant.costPrice,
            imageUrl: parsedInput.imageUrl,
            stock: variant.stock ?? 0,
            lowStockThreshold: variant.lowStockThreshold ?? 0,
            order: index + 1,
          })),
        })

        console.log("Variants: ", createdVariants)
      }
    }

    if (attr1 && attr2) {
      if (variants?.length) {
        const createdVariants = await prisma.$transaction(
          variants.map((variant, index) => {
            return prisma.productVariant.create({
              data: {
                storeId: parsedInput.storeId,
                productId,
                sku: variant.sku,
                price: variant.price,
                costPrice: variant.costPrice,
                imageUrl: parsedInput.imageUrl,
                stock: variant.stock ?? 0,
                lowStockThreshold: variant.lowStockThreshold ?? 0,
                order: index + 1,

                productAttributeValues: {
                  create: [
                    {
                      attributeValue: {
                        connect: {
                          id: attr1.values.find(
                            (v) => v.value === variant.attr1
                          )?.id,
                        },
                      },
                    },
                    {
                      attributeValue: {
                        connect: {
                          id: attr2.values.find(
                            (v) => v.value === variant.attr2
                          )?.id,
                        },
                      },
                    },
                  ],
                },
              },
            })
          })
        )

        console.log("Variants: ", createdVariants)
      }
    }

    revalidatePath(`/${foundProduct.storeId}/products/${product.id}`)

    return { product }
  })
