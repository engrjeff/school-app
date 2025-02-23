"use server"

import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetTeachersArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  program?: string
  faculty?: string
}

export async function getTeachers(args: GetTeachersArgs) {
  const session = await auth()

  if (!session?.user.schoolId) return { teachers: [] }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args.program
  const facultyFilter = args.faculty

  const whereInput: Prisma.TeacherWhereInput = {
    schoolId: session?.user.schoolId,
    programs: {
      some: {
        id: programFilter,
      },
    },
    faculties: {
      some: {
        id: facultyFilter,
      },
    },
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
            middleName: {
              contains: args.q,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
  }

  const totalFiltered = await prisma.teacher.count({
    where: whereInput,
  })

  const teachers = await prisma.teacher.findMany({
    where: whereInput,
    include: { programs: true, faculties: true },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: teachers.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { teachers, pageInfo }
}
