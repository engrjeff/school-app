"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { subjectSchema, updateSubjectSchema } from "./schema"

export const updateSubject = adminActionClient
  .metadata({ actionName: "updateSubject" })
  .schema(updateSubjectSchema)
  .action(async ({ parsedInput }) => {
    const existingCode = await prisma.subject.findFirst({
      where: {
        OR: [
          {
            code: parsedInput.code,
            id: {
              not: parsedInput.id,
            },
            courseId: parsedInput.courseId,
          },
          {
            title: {
              equals: parsedInput.title,
              mode: "insensitive",
            },
            id: {
              not: parsedInput.id,
            },
            courseId: parsedInput.courseId,
          },
        ],
      },
    })

    if (existingCode)
      throw new Error(
        `The given code/title is already in use by another subject in this course.`
      )

    const subject = await prisma.subject.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        units: parsedInput.units,
      },
    })

    revalidatePath(`/courses/${parsedInput.courseId}`)

    return { subject }
  })

export const createSubject = adminActionClient
  .metadata({ actionName: "createSubject" })
  .schema(subjectSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const subject = await prisma.subject.create({
      data: {
        schoolId: user.schoolId!,
        courseId: parsedInput.courseId,
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        units: parsedInput.units,
      },
    })

    revalidatePath(`/courses/${parsedInput.courseId}`)

    return { subject }
  })
