"use server"

import { auth } from "@/auth"

import prisma from "@/lib/db"

export async function checkIfUserHasSchool() {
  const session = await auth()

  if (session?.user.hasSchoolSetUp === true) return true

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
  const session = await auth()

  const userInDb = await prisma.user.findUnique({
    where: { id: session?.user.id },
  })

  if (!userInDb?.schoolId) return { school: null }

  const school = await prisma.school.findFirst({
    where: {
      id: userInDb?.schoolId,
    },
  })

  return {
    school,
  }
}
