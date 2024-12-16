"use server"

import prisma from "@/lib/db"

export const getCategories = async (storeId: string) => {
  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
    include: {
      products: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return categories
}
