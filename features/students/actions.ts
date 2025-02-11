"use server"

import { chunk } from "remeda"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { importStudentSchema } from "./schema"

export const importStudents = adminActionClient
  .metadata({ actionName: "importStudents" })
  .schema(importStudentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const partitionedStudents = chunk(parsedInput, 20)

    const students = await prisma.$transaction(
      partitionedStudents.map((students) => {
        return prisma.student.createMany({
          data: students.map((student) => ({
            ...student,
            birthdate: new Date(student.birthdate),
            schoolId: user.schoolId!,
          })),
        })
      })
    )

    return {
      students,
    }
  })
