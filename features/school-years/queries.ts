"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

interface GetSchoolYearArgs {
  program?: string
}

export async function getSchoolYears(args: GetSchoolYearArgs) {
  const session = await getSession()

  if (!session?.user?.schoolId) return []

  const schoolYears = await prisma.schoolYear.findMany({
    where: {
      schoolId: session?.user.schoolId,
      programOfferingId: args.program,
    },
    include: { semesters: true },
  })

  return schoolYears
}

export async function getSchoolYearById(id: string) {
  const schoolYear = await prisma.schoolYear.findUnique({
    where: {
      id,
    },
    include: {
      semesters: true,
      classes: {
        include: {
          gradeYearLevel: true,
          course: true,
          teacher: true,
          subject: true,
          section: true,
        },
      },
      programOffering: true,
    },
  })

  return schoolYear
}

export async function getSemesterById(semesterId: string) {
  const semester = await prisma.semester.findUnique({
    where: {
      id: semesterId,
    },
    include: {
      classes: {
        include: {
          gradeYearLevel: true,
          course: true,
          teacher: true,
          subject: true,
          section: true,
        },
      },
      schoolYear: {
        include: {
          programOffering: true,
        },
      },
    },
  })

  return semester
}
