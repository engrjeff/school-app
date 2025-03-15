"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

export async function getUserAccunt() {
  const session = await getSession()

  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      teacherProfile: true,
    },
  })

  return user
}
