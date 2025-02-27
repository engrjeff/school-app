"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { schoolYearSchema } from "./schema"

export const createSchoolYear = adminActionClient
  .metadata({ actionName: "createSchoolYear" })
  .schema(schoolYearSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const schoolYear = await prisma.schoolYear.create({
      data: {
        schoolId: user.schoolId!,
        programOfferingId: parsedInput.programOfferingId,
        title: parsedInput.title,
        semesters: {
          createMany: {
            data: parsedInput.semesters,
          },
        },
      },
    })

    revalidatePath("/school-years")

    return { schoolYear }
  })
