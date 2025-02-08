"use server"

import { revalidatePath } from "next/cache"

import { COMMON_PROGRAM_OFFERINGS } from "@/config/constants"
import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
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
            // courses: {
            //   createMany: {
            //     data: program.courses.map((course) => ({
            //       title: course.title,
            //       code: program.code,
            //       schoolId: user.schoolId!,
            //     })),
            //   },
            // },
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
              },
            })
          })
        )
      })
    ).then((values) => values)

    return { createdPrograms }
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
