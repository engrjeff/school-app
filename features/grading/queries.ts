"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

export async function getGradingComponents() {
  const session = await getSession()

  const gradingComponents = await prisma.gradeComponent.findMany({
    where: {
      teacherId: session?.user.teacherProfileId,
    },
    include: {
      parts: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  return { gradingComponents }
}
