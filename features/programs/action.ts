"use server"

import { revalidatePath } from "next/cache"

import { COMMON_PROGRAM_OFFERINGS } from "@/config/constants"
import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
  commonCoursesSchema,
  commonProgramsSchema,
  programSchema,
  updateProgramSchema,
} from "./schema"

export const createCurriculumPrograms = adminActionClient
  .metadata({ actionName: "createCurriculumPrograms" })
  .schema(commonProgramsSchema)
  .action(async ({ parsedInput: { programs }, ctx: { user } }) => {
    const createdPrograms = await prisma.$transaction(
      programs.map((program) => {
        return prisma.programOffering.create({
          data: {
            title: program.title,
            code: program.code,
            description: program.description,
            schoolId: user.schoolId!,
            enrollmentGradingPeriod: {
              createMany: {
                data: program.gradingPeriod.map((gp, gpIdx) => ({
                  title: gp,
                  order: gpIdx + 1,
                })),
              },
            },
          },
        })
      })
    )

    // create courses with subjects
    await Promise.all(
      createdPrograms.map(async (program) => {
        const pr = COMMON_PROGRAM_OFFERINGS.find(
          (p) => p.title === program.title
        )!

        return prisma.$transaction(
          pr.courses.map((course) => {
            return prisma.course.create({
              data: {
                schoolId: program.schoolId,
                programOfferingId: program.id,
                title: course.title,
                code: course.code,
                subjects: {
                  createMany: {
                    data: course.subjects.map((subject) => ({
                      units: 1,
                      schoolId: program.schoolId,
                      title: subject.title,
                      code: subject.code ?? "--",
                    })),
                  },
                },
                gradeYearLevels: {
                  createMany: {
                    data: pr.gradeYearLevels,
                  },
                },
              },
            })
          })
        )
      })
    ).then((values) => values)

    return { createdPrograms }
  })

export const createCommonSHSCourses = adminActionClient
  .metadata({ actionName: "createCommonCourses" })
  .schema(commonCoursesSchema)
  .action(async ({ parsedInput: { courses }, ctx: { user } }) => {
    // find senior high
    const shs = await prisma.programOffering.findFirst({
      where: {
        code: "SHS",
        schoolId: user.schoolId!,
      },
    })

    if (!shs) return null

    const createdCourses = await prisma.$transaction(
      courses.map((course) => {
        return prisma.course.create({
          data: {
            schoolId: shs.schoolId,
            programOfferingId: shs.id,
            title: course.title,
            code: course.code,
            subjects: {
              createMany: {
                data: course.subjects.map((subject) => ({
                  units: 1,
                  schoolId: shs.schoolId,
                  title: subject.title,
                  code: subject.code ?? "--",
                })),
              },
            },
            gradeYearLevels: {
              createMany: {
                data: [
                  { displayName: "Grade", level: "11" },
                  { displayName: "Grade", level: "12" },
                ],
              },
            },
          },
        })
      })
    )

    return { createdCourses }
  })

export const createProgram = adminActionClient
  .metadata({ actionName: "createProgram" })
  .schema(programSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const foundProgram = await prisma.programOffering.findFirst({
      where: {
        title: {
          equals: parsedInput.title,
          mode: "insensitive",
        },
      },
    })

    if (foundProgram) throw new Error(`${parsedInput.title} already exists.`)

    const program = await prisma.programOffering.create({
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        schoolId: user.schoolId!,
      },
    })

    revalidatePath("/program-offerings")

    return { program }
  })

export const updateProgram = adminActionClient
  .metadata({ actionName: "updateteProgram" })
  .schema(updateProgramSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const program = await prisma.programOffering.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        code: parsedInput.code,
        description: parsedInput.description,
        schoolId: user.schoolId!,
      },
    })

    revalidatePath("/program-offerings")

    return { program }
  })
