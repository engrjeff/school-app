"use server"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { schoolSchema } from "./schema"

export const createSchool = adminActionClient
  .metadata({ actionName: "createSchool" })
  .schema(schoolSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const school = await prisma.school.create({
      data: {
        ...parsedInput,
        fullAddress: parsedInput.fullAddress!,
        schoolAdmins: {
          connect: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return {
      school,
    }
  })
