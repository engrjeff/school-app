"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { importStudentSchema } from "./schema"

export const importStudents = adminActionClient
  .metadata({ actionName: "importStudents" })
  .schema(importStudentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const students = await prisma.student.createMany({
      data: parsedInput.map((student) => ({
        ...student,
        birthdate: new Date(student.birthdate),
        schoolId: user.schoolId!,
      })),
    })

    revalidatePath("/students")

    return {
      students,
    }
  })
