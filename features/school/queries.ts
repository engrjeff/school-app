"use server"

import { getSession } from "@/auth"

import prisma from "@/lib/db"

export async function checkIfUserHasSchool() {
  const session = await getSession()

  if (session?.user.schoolId) return true

  const school = await prisma.school.findFirst({
    where: {
      schoolAdmins: {
        some: {
          id: session?.user.id,
        },
      },
    },
  })

  return school ? true : false
}

export async function getSchoolOfUser() {
  const session = await getSession()

  const userInDb = await prisma.user.findUnique({
    where: { id: session?.user.id },
  })

  if (!userInDb?.schoolId) return { school: null }

  const school = await prisma.school.findFirst({
    where: {
      id: userInDb?.schoolId,
    },
    include: {
      programOfferings: {
        include: {
          _count: {
            select: {
              courses: true,
            },
          },
        },
      },
      courses: {
        include: { programOffering: true },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  return {
    school,
  }
}
