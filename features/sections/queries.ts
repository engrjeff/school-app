"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

export interface GetSectionsArgs {
  program?: string
  course?: string
}

/**
 *
 * @description returns sections grouped by grade/year level
 */
export async function getSections(args: GetSectionsArgs) {
  const session = await getSession()

  if (!session?.user.schoolId) return { sections: null }

  const programFilter = args.program

  const sections = await prisma.programOffering.findMany({
    where: { schoolId: session.user.schoolId },
    include: {
      courses: {
        where: { programOfferingId: programFilter },
        include: {
          gradeYearLevels: {
            include: { sections: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  })

  return { data: sections }
}
