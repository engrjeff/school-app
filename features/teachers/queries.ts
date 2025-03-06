"use server"

import { getSession } from "@/auth"
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
  const session = await getSession()

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

  const totalFilteredPromise = prisma.teacher.count({
    where: whereInput,
  })

  const teachersPromise = prisma.teacher.findMany({
    where: whereInput,
    include: {
      programs: true,
      faculties: true,
      classes: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const [totalFiltered, teachers] = await Promise.all([
    totalFilteredPromise,
    teachersPromise,
  ])

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: teachers.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { teachers, pageInfo }
}

export async function getTeacherById(id: string) {
  if (!id) return null

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      school: true,
      faculties: {
        include: {
          programOffering: true,
        },
      },
      classes: {
        include: {
          subject: true,
          section: true,
          semester: true,
          schoolYear: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
      },
    },
  })

  return teacher
}
