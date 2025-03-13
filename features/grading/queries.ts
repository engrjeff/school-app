"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

export async function getGradingComponents() {
  const session = await getSession()

  const gradingComponents = await prisma.subjectGradeComponent.findMany({
    where: {
      createdById: session?.user.id,
    },
    include: {
      subcomponents: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  return { gradingComponents }
}
