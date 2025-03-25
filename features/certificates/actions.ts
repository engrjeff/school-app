"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import { certificateSchema } from "./schema"

export const createCertificateTemplate = authActionClient
  .metadata({ actionName: "createCertificateTemplate" })
  .schema(certificateSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const certTemplate = await prisma.certificateTemplate.create({
      data: {
        ...parsedInput,
        schoolId: user.schoolId!,
        createdById: user.id,
        signatories: [...parsedInput.signatories],
      },
    })

    revalidatePath("/certificates")

    return { certTemplate }
  })
