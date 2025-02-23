"use server"

import { revalidatePath } from "next/cache"
import { chunk } from "remeda"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { importStudentSchema, studentSchema } from "./schema"

export const createStudent = adminActionClient
  .metadata({ actionName: "createStudent" })
  .schema(studentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const student = await prisma.student.create({
      data: {
        ...parsedInput,
        birthdate: new Date(parsedInput.birthdate),
        schoolId: user.schoolId!,
      },
    })

    revalidatePath("/students")

    return {
      student,
    }
  })

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
