"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { teacherActionClient } from "@/lib/safe-action"

import {
  assignGradeComponentsSchema,
  correctResponseSchema,
  gradeComponentPartScoreSchema,
  gradeComponentSchema,
  gradeSubcomponentIdSchema,
  gradeSubComponentSchema,
  gradeSubComponentScoreSchema,
  updateGradeComponentSchema,
  updateGradeSubComponentSchema,
} from "./schema"

export const createGradeComponent = teacherActionClient
  .metadata({ actionName: "createGradeComponent" })
  .schema(gradeComponentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const gradeComponent = await prisma.subjectGradeComponent.create({
      data: {
        createdById: user.id,
        label: parsedInput.label,
        title: parsedInput.title,
        percentage: parsedInput.percentage,
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

    const gradeComponent = await prisma.subjectGradeComponent.update({
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
    async ({
      parsedInput: { classSubjectId, gradingPeriodId, gradeComponents },
      ctx: { user },
    }) => {
      if (!user.teacherProfileId)
        throw new Error(
          "Unauthorized: You have no permission to perform the action."
        )

      console.time("assignGradeComponents")
      // find the class subject
      const foundClassSubject = await prisma.classSubject.findUnique({
        where: { id: classSubjectId },
        include: {
          enrollmentClass: {
            include: {
              students: { select: { id: true } },
            },
          },
        },
      })

      if (!foundClassSubject) throw new Error("Class subject not found.")

      // for each grading period of the enrollment class, generate `periodicGrades` for each student
      const { students } = foundClassSubject.enrollmentClass

      // get the grade components
      const gradeComponentsToAssign =
        await prisma.subjectGradeComponent.findMany({
          where: {
            id: { in: gradeComponents.map((g) => g.id) },
          },
        })

      const gradeSubcomponents = await prisma.$transaction(
        gradeComponentsToAssign.map((gc) => {
          return prisma.subjectGradeSubComponent.createManyAndReturn({
            data: [1, 2].map((n) => ({
              gradingPeriodId,
              classSubjectId: foundClassSubject.id,
              gradeComponentId: gc.id,
              order: n,
              title:
                gc.title
                  .split(" ")
                  .map((c) => c.charAt(0).toUpperCase())
                  .join("") + n.toString(),
              highestPossibleScore: 10,
            })),
          })
        })
      )

      console.log(
        `Created ${gradeSubcomponents.flat().length} grade subcomponents`
      )

      // for each subjectGrade in periodicGrades, assign the grade components
      const periodicGrades = await prisma.subjectGrade.createManyAndReturn({
        data: students.map((student) => ({
          studentId: student.id,
          subjectId: foundClassSubject.id,
          gradingPeriodId,
        })),
      })

      console.log(
        `Created ${periodicGrades.length} periodic grades for ${students.length} students.`
      )

      const result = await prisma.$transaction(
        periodicGrades.map((p) => {
          return prisma.subjectGrade.update({
            where: {
              id: p.id,
            },
            data: {
              gradeComponents: {
                connect: gradeComponents,
              },
              scores: {
                createMany: {
                  data: gradeSubcomponents
                    .flat()
                    .map((gsc) => ({
                      subjectGradeComponentId: gsc.gradeComponentId,
                      subjectGradeSubComponentId: gsc.id,
                    }))
                    .flat(),
                },
              },
            },
            select: { id: true, _count: { select: { scores: true } } },
          })
        })
      )

      console.log(
        `Created ${result.reduce((s, i) => (s += i._count.scores), 0)} blank subject scores.`
      )

      console.timeEnd("assignGradeComponents")

      revalidatePath(`/classes/${classSubjectId}/grading`)

      return { success: true }
    }
  )

export const upsertGradeScore = teacherActionClient
  .metadata({ actionName: "upsertGradeScore" })
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

export const updateSubjectGradeScore = teacherActionClient
  .metadata({ actionName: "updateSubjectGradeScore" })
  .schema(gradeSubComponentScoreSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    // update the score
    const score = await prisma.subjectGradeSubComponentScore.update({
      where: { id: parsedInput.scoreId },
      data: {
        score:
          parsedInput.score === undefined
            ? {
                set: null,
              }
            : parsedInput.score,
      },
    })

    return { score }
  })

export const createGradeSubComponent = teacherActionClient
  .metadata({ actionName: "createGradeSubComponent" })
  .schema(gradeSubComponentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const gradeSubComponent = await prisma.subjectGradeSubComponent.create({
      data: {
        gradingPeriodId: parsedInput.gradingPeriodId,
        classSubjectId: parsedInput.classSubjectId,
        gradeComponentId: parsedInput.parentGradeComponentId,
        title: parsedInput.title,
        order: parsedInput.order,
        highestPossibleScore: parsedInput.highestPossibleScore,
      },
    })

    // must also generate blank scores
    const periodicGrades = await prisma.subjectGrade.findMany({
      where: {
        subjectId: parsedInput.classSubjectId,
        gradingPeriodId: parsedInput.gradingPeriodId,
      },
    })

    await prisma.$transaction(
      periodicGrades.map((p) => {
        return prisma.subjectGrade.update({
          where: {
            id: p.id,
          },
          data: {
            scores: {
              createMany: {
                data: [
                  {
                    subjectGradeComponentId: gradeSubComponent.gradeComponentId,
                    subjectGradeSubComponentId: gradeSubComponent.id,
                  },
                ],
              },
            },
          },
        })
      })
    )

    revalidatePath(`/classes/${parsedInput.classSubjectId}/grading`)

    return { gradeSubComponent }
  })

export const updateGradeSubComponent = teacherActionClient
  .metadata({ actionName: "updateGradeSubComponent" })
  .schema(updateGradeSubComponentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const gradeSubComponent = await prisma.subjectGradeSubComponent.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        order: parsedInput.order,
        highestPossibleScore: parsedInput.highestPossibleScore,
      },
    })

    revalidatePath(`/classes/${parsedInput.classSubjectId}/grading`)

    return { gradeSubComponent }
  })

export const deleteGradeSubComponent = teacherActionClient
  .metadata({ actionName: "deleteGradeSubComponent" })
  .schema(gradeSubcomponentIdSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const found = await prisma.subjectGradeSubComponent.findUnique({
      where: { id: parsedInput.id },
    })

    if (!found) throw new Error(`The grade subcomponent does not exist.`)

    await prisma.subjectGradeSubComponent.delete({
      where: { id: parsedInput.id },
    })

    revalidatePath(`/classes/${found.classSubjectId}/grading`)

    return { success: true }
  })

// correct response
export const createCorrectResponse = teacherActionClient
  .metadata({ actionName: "createCorrectResponse" })
  .schema(correctResponseSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user.teacherProfileId)
      throw new Error(
        "Unauthorized: You have no permission to perform the action."
      )

    const correctResponse = await prisma.correctResponse.create({
      data: {
        createdById: user.id,
        gradeSubComponentId: parsedInput.gradeSubComponentId,
        studentCount: parsedInput.studentCount,
        items: {
          createMany: {
            data: parsedInput.items.map((q) => ({
              question: q.question,
              correctCount: q.correctCount,
              correctCountPercent:
                (q.correctCount / parsedInput.studentCount) * 100,
            })),
          },
        },
      },
    })

    revalidatePath("/grading")

    return { correctResponse }
  })
