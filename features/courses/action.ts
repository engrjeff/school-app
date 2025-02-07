"use server"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { courseSchema } from "./schema"

export const createCourse = adminActionClient
  .metadata({ actionName: "createCourse" })
  .schema(courseSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const course = await prisma.course.create({
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        schoolId: parsedInput.schoolId ?? user.schoolId,
        programOfferingId: parsedInput.programOfferingId,
        subjects: {
          createMany: {
            data: parsedInput.subjects.map((subject) => ({
              title: subject.title,
              code: subject.code,
              description: subject.description,
              units: subject.units,
              schoolId: parsedInput.schoolId ?? user.schoolId,
            })),
          },
        },
      },
    })

    return { course }
  })
