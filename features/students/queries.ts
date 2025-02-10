"use server"

import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetStudentsArgs = {
  q?: string
  page?: number
  pageSize?: number
}

export async function getStudentsOfCurrentSchool(args: GetStudentsArgs) {
  const session = await auth()

  if (!session?.user.schoolId) return { students: [] }

  const whereInput: Prisma.StudentWhereInput = {
    schoolId: session?.user.schoolId,
    OR: args.q
      ? [
          {
            firstName: {
              contains: args.q,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: args.q,
              mode: "insensitive",
            },
          },
          {
            studentId: {
              contains: args.q,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
  }

  const totalFiltered = await prisma.student.count({
    where: whereInput,
  })

  const students = await prisma.student.findMany({
    where: whereInput,
    orderBy: {
      lastName: "asc",
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  console.log(totalFiltered)

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: students.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return {
    students,
    pageInfo,
  }
}
