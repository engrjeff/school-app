"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { teacherActionClient } from "@/lib/safe-action"

import {
  assignGradeComponentsSchema,
  gradeComponentPartScoreSchema,
  gradeComponentSchema,
  updateGradeComponentSchema,
} from "./schema"

export const createGradeComponent = teacherActionClient
  .metadata({ actionName: "createGradeComponent" })
  .schema(gradeComponentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const gradeComponent = await prisma.gradeComponent.create({
      data: {
        teacherId: user.teacherProfileId,
        label: parsedInput.label,
        title: parsedInput.title,
        percentage: parsedInput.percentage,
        parts: {
          createMany: {
            data: parsedInput.parts,
          },
        },
      },
    })

    revalidatePath("/grading")

    return { gradeComponent }
  })

export const updateGradeComponent = teacherActionClient
  .metadata({ actionName: "updateGradeComponent" })
  .schema(updateGradeComponentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const gradeComponent = await prisma.gradeComponent.update({
      where: { id: parsedInput.id },
      data: {
        label: parsedInput.label,
        title: parsedInput.title,
        percentage: parsedInput.percentage,
      },
    })

    revalidatePath("/grading")

    return { gradeComponent }
  })

export const assignGradeComponents = teacherActionClient
  .metadata({ actionName: "assignGradeComponents" })
  .schema(assignGradeComponentsSchema)
  .action(
    async ({ parsedInput: { classId, gradeComponents }, ctx: { user } }) => {
      if (!user.teacherProfileId)
        throw new Error(
          "Unauthorized: You have no permission to perform the action."
        )

      // find the class
      const foundClass = await prisma.class.findUnique({
        where: { id: classId },
        include: { gradingPeriods: { select: { id: true } }, students: true },
      })

      if (!foundClass) throw new Error("Class not found.")

      // for each grading period of the class, assign the grade components
      await prisma.$transaction(
        foundClass.gradingPeriods.map((gp) => {
          return prisma.gradingPeriod.update({
            where: { id: gp.id },
            data: {
              gradeComponents: {
                connect: gradeComponents,
              },
            },
          })
        })
      )

      // generate blank student grades
      await prisma.$transaction(
        foundClass.gradingPeriods.map((gp) => {
          return prisma.studentGrade.createMany({
            data: foundClass.students.map((s) => ({
              studentId: s.id,
              gradingPeriodId: gp.id,
            })),
          })
        })
      )

      revalidatePath(`/classes/${classId}/grading`)

      return { success: true }
    }
  )

export const upsertGradeScore = teacherActionClient
  .metadata({ actionName: "createGradeScore" })
  .schema(gradeComponentPartScoreSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (parsedInput.score === undefined && parsedInput.scoreId) {
      // delete
      await prisma.gradeComponentPartScore.delete({
        where: {
          id: parsedInput.scoreId,
        },
      })

      return { score: { id: parsedInput.scoreId } }
    }

    if (parsedInput.score === undefined) return null

    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    if (!parsedInput.studentGradeId) {
      // create a student grade
      const sg = await prisma.studentGrade.create({
        data: {
          studentId: parsedInput.studentId,
          gradingPeriodId: parsedInput.gradingPeriodId,
        },
      })

      // create the score
      const score = await prisma.gradeComponentPartScore.create({
        data: {
          score: parsedInput.score,
          parentGradeComponentId: parsedInput.parentGradeComponentId,
          gradeComponentPartId: parsedInput.gradeComponentPartId,
          studentGradeId: sg.id,
        },
      })

      return { score }
    }

    // upsert the score
    const score = await prisma.gradeComponentPartScore.upsert({
      where: { id: parsedInput.scoreId },
      update: {
        score: parsedInput.score,
      },
      create: {
        score: parsedInput.score,
        parentGradeComponentId: parsedInput.parentGradeComponentId,
        gradeComponentPartId: parsedInput.gradeComponentPartId,
        studentGradeId: parsedInput.studentGradeId,
      },
    })

    return { score }
  })
