"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { courseSchema, updateCourseSchema } from "./schema"

export const createCourse = adminActionClient
  .metadata({ actionName: "createCourse" })
  .schema(courseSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const course = await prisma.course.create({
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        schoolId: user.schoolId!,
        programOfferingId: parsedInput.programOfferingId,
        subjects: {
          createMany: {
            data: parsedInput.subjects.map((subject) => ({
              title: subject.title,
              code: subject.code,
              description: subject.description,
              units: subject.units,
              schoolId: user.schoolId!,
            })),
          },
        },
        gradeYearLevels: {
          createMany: {
            data: parsedInput.gradeYearLevels.levels.map((level) => ({
              displayName: parsedInput.gradeYearLevels.displayName,
              level: level.level,
            })),
          },
        },
      },
    })

    return { course }
  })

export const updateCourse = adminActionClient
  .metadata({ actionName: "updateCourse" })
  .schema(updateCourseSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const course = await prisma.course.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        schoolId: user.schoolId!,
      },
    })

    revalidatePath(`/courses/${parsedInput.id}`)

    return { course }
  })
