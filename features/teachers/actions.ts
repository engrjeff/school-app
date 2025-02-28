"use server"

import { chunk } from "remeda"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
  importTeacherSchema,
  teacherSchema,
  updateTeacherSchema,
} from "./schema"

export const createTeacher = adminActionClient
  .metadata({ actionName: "createTeacher" })
  .schema(teacherSchema)
  .action(
    async ({
      parsedInput: { facultyId, programOfferingId, ...data },
      ctx: { user },
    }) => {
      const teacher = await prisma.teacher.create({
        data: {
          ...data,
          programs: {
            connect: {
              id: programOfferingId,
            },
          },
          faculties: {
            connect: {
              id: facultyId,
            },
          },
          schoolId: user.schoolId!,
        },
      })

      return {
        teacher,
      }
    }
  )

export const importTeachers = adminActionClient
  .metadata({ actionName: "importTeachers" })
  .schema(importTeacherSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { teachers: teachersData, programOfferingId, facultyId } = parsedInput

    const partitionedTeachers = chunk(teachersData, 20)

    const teachers = await prisma.$transaction(
      partitionedTeachers.map((teacherArr) => {
        return prisma.teacher.createManyAndReturn({
          data: teacherArr.map((teacher) => ({
            ...teacher,
            schoolId: user.schoolId!,
          })),
        })
      })
    )

    // assign teachers to program
    await prisma.programOffering.update({
      where: { id: programOfferingId },
      data: {
        teachers: {
          connect: teachers.flat().map((teacher) => ({ id: teacher.id })),
        },
      },
    })

    // assign teachers to faculty
    await prisma.faculty.update({
      where: { id: facultyId },
      data: {
        teachers: {
          connect: teachers.flat().map((teacher) => ({ id: teacher.id })),
        },
      },
    })

    return {
      teachers: teachers.flat(),
    }
  })

export const updateTeacher = adminActionClient
  .metadata({ actionName: "updateTeacher" })
  .schema(updateTeacherSchema)
  .action(async ({ parsedInput }) => {
    const teacher = await prisma.teacher.update({
      where: {
        id: parsedInput.id,
      },
      data: {
        teacherId: parsedInput.teacherId,
        firstName: parsedInput.firstName,
        lastName: parsedInput.lastName,
        middleName: parsedInput.middleName,
        suffix: parsedInput.suffix,
        address: parsedInput.address,
        phone: parsedInput.phone,
        email: parsedInput.email,
        gender: parsedInput.gender,
      },
    })

    return {
      teacher,
    }
  })
