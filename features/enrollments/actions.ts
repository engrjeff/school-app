"use server"

import { revalidatePath } from "next/cache"
import { StudentStatus } from "@prisma/client"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
  classStudentsSchema,
  classSubjectArraySchema,
  enrollmentSchema,
} from "./schema"

export const createEnrollment = adminActionClient
  .metadata({ actionName: "createEnrollment" })
  .schema(enrollmentSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    // get the program grading period
    const program = await prisma.programOffering.findUnique({
      where: { id: parsedInput.programOfferingId },
      include: { enrollmentGradingPeriod: { select: { id: true } } },
    })

    if (!program) throw new Error("Program not found.")

    const enrollment = await prisma.enrollmentClass.create({
      data: {
        schoolId: user.schoolId!,
        programOfferingId: parsedInput.programOfferingId,
        schoolYearId: parsedInput.schoolYearId,
        semesterId: parsedInput.semesterId,
        courseId: parsedInput.courseId,
        gradeYearLevelId: parsedInput.gradeYearLevelId,
        sectionId: parsedInput.sectionId,
        subjects: {
          createMany: {
            data: parsedInput.subjects.map((s) => ({
              subjectId: s.subjectId,
              teacherId: s.teacherId,
            })),
          },
        },
        gradingPeriods: {
          connect: program.enrollmentGradingPeriod,
        },
      },
    })

    revalidatePath(`/enrollments`)

    return { enrollment }
  })

export const addSubjectsToEnrollment = adminActionClient
  .metadata({ actionName: "addSubjectsToEnrollment" })
  .schema(classSubjectArraySchema)
  .action(async ({ parsedInput }) => {
    // find the enrollment class
    const enrollment = await prisma.enrollmentClass.findUnique({
      where: { id: parsedInput.enrollmentClassId },
    })

    if (!enrollment) throw new Error("Enrollment class cannot be found.")

    // add the subjects to the enrollment class
    const subjects = await prisma.classSubject.createMany({
      data: parsedInput.subjects.map((s) => ({
        subjectId: s.subjectId,
        teacherId: s.teacherId,
        enrollmentClassId: parsedInput.enrollmentClassId,
      })),
    })

    revalidatePath(`/enrollments`)

    return { subjects }
  })

export const addStudentsToEnrollment = adminActionClient
  .metadata({ actionName: "addStudentsToEnrollment" })
  .schema(classStudentsSchema)
  .action(async ({ parsedInput }) => {
    // find the enrollment class
    const enrollment = await prisma.enrollmentClass.findUnique({
      where: { id: parsedInput.enrollmentClassId },
    })

    if (!enrollment) throw new Error("Enrollment class cannot be found.")

    // add the students to the enrollment class
    await prisma.enrollmentClass.update({
      where: { id: parsedInput.enrollmentClassId },
      data: {
        students: {
          connect: parsedInput.studentIds.map((s) => ({ id: s.studentId })),
        },
      },
    })

    // update students' status
    await prisma.student.updateMany({
      where: {
        id: { in: parsedInput.studentIds.map((s) => s.studentId) },
      },
      data: {
        currentCourseId: enrollment.courseId,
        currentGradeYearLevelId: enrollment.gradeYearLevelId,
        currentSectionId: enrollment.sectionId,
        status: StudentStatus.ENROLLED,
      },
    })

    revalidatePath(`/enrollments`)

    return { enrollment }
  })
