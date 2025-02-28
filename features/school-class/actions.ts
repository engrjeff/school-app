"use server"

import { revalidatePath } from "next/cache"
import { StudentStatus } from "@prisma/client"

import prisma from "@/lib/db"
import { adminActionClient } from "@/lib/safe-action"

import { schoolClassSchema } from "./schema"

export const createSchoolClass = adminActionClient
  .metadata({ actionName: "createSchoolClass" })
  .schema(schoolClassSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const schoolClass = await prisma.class.create({
      data: {
        schoolId: user.schoolId!,
        programOfferingId: parsedInput.programOfferingId,
        schoolYearId: parsedInput.schoolYearId,
        semesterId: parsedInput.semesterId,
        courseId: parsedInput.courseId,
        gradeYearLevelId: parsedInput.gradeYearLevelId,
        sectionId: parsedInput.sectionId,
        subjectId: parsedInput.subjectId,
        teacherId: parsedInput.teacherId,
        students: {
          connect: parsedInput.studentIds.map((s) => ({ id: s.studentId })),
        },
        gradingPeriods: {
          createMany: {
            data: parsedInput.gradingPeriods,
          },
        },
      },
    })

    if (schoolClass.id) {
      // update the students' current section
      await prisma.student.updateMany({
        where: {
          id: {
            in: parsedInput.studentIds.map((s) => s.studentId),
          },
        },
        data: {
          currentSectionId: schoolClass.sectionId,
          status: StudentStatus.ENROLLED,
        },
      })
    }

    revalidatePath(
      `/school-year/${schoolClass.schoolYearId}?program=${schoolClass.programOfferingId}`
    )

    return { schoolClass }
  })
