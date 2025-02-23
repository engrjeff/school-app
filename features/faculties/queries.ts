"use server"

import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetFacultiesArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  program?: string
}

export async function getFaculties(args: GetFacultiesArgs) {
  const session = await auth()

  if (!session?.user.schoolId) return { faculties: [] }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  if (!args.program) {
    const firstProgram = await prisma.programOffering.findFirst({
      orderBy: { createdAt: "asc" },
    })

    redirect(`/faculties?program=${firstProgram?.id}`)
  }

  const programFilter = args.program

  const whereInput: Prisma.FacultyWhereInput = {
    schoolId: session?.user.schoolId,
    programOfferingId: programFilter,
    title: {
      contains: args.q,
      mode: "insensitive",
    },
  }

  const totalFiltered = await prisma.faculty.count({
    where: whereInput,
  })

  const faculties = await prisma.faculty.findMany({
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
    itemCount: faculties.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { faculties, pageInfo }
}
