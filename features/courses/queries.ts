"use server"

import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export async function getCourseById(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      subjects: {
        orderBy: {
          title: "asc",
        },
      },
      gradeYearLevels: true,
    },
  })

  return { course }
}

export type GetCoursesArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  program?: string
}

export async function getCoursesOfCurrentSchool(args: GetCoursesArgs) {
  const session = await auth()

  if (!session?.user.schoolId) return { courses: [] }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args?.program ? args.program.split(",") : undefined

  const whereInput: Prisma.CourseWhereInput = {
    schoolId: session?.user.schoolId,
    OR: args.q
      ? [
          {
            title: {
              contains: args.q,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: args.q,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
    programOfferingId: {
      in: programFilter,
    },
  }

  const totalFiltered = await prisma.course.count({
    where: whereInput,
  })

  const courses = await prisma.course.findMany({
    where: whereInput,
    include: { programOffering: true },
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
    itemCount: courses.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return {
    courses,
    pageInfo,
  }
}
