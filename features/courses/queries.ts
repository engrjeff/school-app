"use server"

import prisma from "@/lib/db"

export async function getCourseById(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { subjects: true },
  })

  return { course }
}
