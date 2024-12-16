"use server"

import { auth } from "@clerk/nextjs/server"

import prisma from "@/lib/db"

export const getStores = async () => {
  const user = await auth()

  if (!user?.userId) return []

  const stores = await prisma.store.findMany({
    where: {
      ownerId: user.userId!,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return stores
}

export const getStoreById = async (storeId: string) => {
  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  })

  return store
}

export const getDiscounts = async (storeId: string) => {
  const discounts = await prisma.discount.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return discounts
}
