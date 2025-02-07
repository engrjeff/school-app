"use server"

import prisma from "@/lib/db"

export async function getProgramById(id: string) {
  const program = await prisma.programOffering.findUnique({
    where: {
      id,
    },
    include: {
      courses: true,
    },
  })

  return { program }
}
