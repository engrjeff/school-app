"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import {
  bulkSectionSchema,
  reorderSectionSchema,
  sectionSchema,
  updateSectionSchema,
} from "./schema"

export const createSection = adminActionClient
  .metadata({ actionName: "createSection" })
  .schema(sectionSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.schoolId)
      throw new Error("School is required when adding sections.")

    const section = await prisma.section.create({
      data: {
        name: parsedInput.name,
        gradeYearLevelId: parsedInput.gradeYearLevelId,
        order: parsedInput.order,
        schoolId: user.schoolId,
      },
    })

    revalidatePath("/sections")

    return { section }
  })

export const importSections = adminActionClient
  .metadata({ actionName: "importSections" })
  .schema(bulkSectionSchema)
  .action(
    async ({ parsedInput: { sections: sectionsData }, ctx: { user } }) => {
      if (!user?.schoolId)
        throw new Error("School is required when adding sections.")

      const sections = await prisma.section.createMany({
        data: sectionsData.map((section) => ({
          name: section.name,
          order: section.order,
          gradeYearLevelId: section.gradeYearLevelId,
          schoolId: user.schoolId!,
        })),
      })

      revalidatePath("/sections")

      return {
        sections,
      }
    }
  )

export const updateSection = adminActionClient
  .metadata({ actionName: "updateSection" })
  .schema(updateSectionSchema)
  .action(async ({ parsedInput }) => {
    const foundSection = await prisma.section.findUnique({
      where: { id: parsedInput.id },
    })

    if (!foundSection) throw new Error("Section not found.")

    const section = await prisma.section.update({
      where: { id: parsedInput.id },
      data: {
        name: parsedInput.name,
        gradeYearLevelId: parsedInput.gradeYearLevelId,
      },
    })

    revalidatePath("/sections")

    return { section }
  })

export const reorderSections = adminActionClient
  .metadata({ actionName: "reorderSections" })
  .schema(reorderSectionSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!user?.schoolId)
      throw new Error("School is required when updating sections.")

    const updatedSections = await prisma.$transaction(
      parsedInput.map((section, order) => {
        return prisma.section.update({
          where: { id: section.id },
          data: { order: order + 1 },
        })
      })
    )

    revalidatePath("/sections")

    return {
      updatedSections,
    }
  })
