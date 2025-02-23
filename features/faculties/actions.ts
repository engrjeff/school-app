"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
  facultyArraySchema,
  facultySchema,
  requireFacultyIdSchema,
  updateFacultySchema,
} from "./schema"

export const createFaculty = adminActionClient
  .metadata({ actionName: "createFaculty" })
  .schema(facultySchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const foundFaculty = await prisma.faculty.findFirst({
      where: {
        title: {
          equals: parsedInput.title,
          mode: "insensitive",
        },
        AND: {
          programOfferingId: {
            equals: parsedInput.programOfferingId,
          },
        },
      },
      include: {
        programOffering: {
          select: { code: true },
        },
      },
    })

    if (foundFaculty)
      throw new Error(
        `${parsedInput.title} already exists under ${foundFaculty.programOffering.code}.`
      )

    const faculty = await prisma.faculty.create({
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        programOfferingId: parsedInput.programOfferingId,
        schoolId: user.schoolId!,
      },
    })

    revalidatePath("/faculties")

    return { faculty }
  })

export const importFaculties = adminActionClient
  .metadata({ actionName: "importFaculties" })
  .schema(facultyArraySchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const faculties = await prisma.faculty.createMany({
      data: parsedInput.map((f) => ({
        title: f.title,
        description: f.description,
        programOfferingId: f.programOfferingId,
        schoolId: user.schoolId!,
      })),
    })

    revalidatePath("/faculties")

    return { faculties }
  })

export const updateFaculty = adminActionClient
  .metadata({ actionName: "updateFaculty" })
  .schema(updateFacultySchema)
  .action(async ({ parsedInput }) => {
    const foundFaculty = await prisma.faculty.findUnique({
      where: { id: parsedInput.id },
    })

    if (!foundFaculty) throw new Error("Faculty not found.")

    const faculty = await prisma.faculty.update({
      where: { id: parsedInput.id },
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        programOfferingId: parsedInput.programOfferingId,
      },
    })

    revalidatePath("/faculties")

    return { faculty }
  })

export const deleteFaculty = adminActionClient
  .metadata({ actionName: "deleteFaculty" })
  .schema(requireFacultyIdSchema)
  .action(async ({ parsedInput }) => {
    const foundFaculty = await prisma.faculty.findUnique({
      where: { id: parsedInput.id },
    })

    if (!foundFaculty)
      throw new Error(
        "Faculty not found. Either it does not exist or was already deleted."
      )

    await prisma.faculty.delete({
      where: { id: parsedInput.id },
    })

    revalidatePath("/faculties")

    return { success: true }
  })
