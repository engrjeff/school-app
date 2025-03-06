"use server"

import { getSession } from "@/auth"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetProgramsArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
}

export async function getPrograms(args: GetProgramsArgs) {
  const session = await getSession()

  if (!session?.user?.schoolId)
    return {
      programs: [],
    }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const whereInput: Prisma.ProgramOfferingWhereInput = {
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
  }

  const totalFiltered = await prisma.programOffering.count({
    where: whereInput,
  })

  const programs = await prisma.programOffering.findMany({
    where: whereInput,
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
    itemCount: programs.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { programs, pageInfo }
}

export async function getProgramById(id: string) {
  const program = await prisma.programOffering.findUnique({
    where: {
      id,
    },
    include: {
      courses: true,
    },
  })

  return { program }
}
