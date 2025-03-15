"use server"

import { cache } from "react"
import { getSession } from "@/auth"
import { Prisma, ROLE } from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetEnrollmentsArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  course?: string
  program?: string
  schoolYear?: string
  semester?: string
  gradeYearLevel?: string
  section?: string
  teacher?: string
  view?: "grid" | "list"
}

export async function getEnrollments(args: GetEnrollmentsArgs) {
  const session = await getSession()

  if (!session?.user.schoolId) return { enrollments: [] }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args?.program ?? undefined
  const courseFilter = args?.course ?? undefined
  const schoolYearFilter = args?.schoolYear ?? undefined
  const semesterFilter = args?.semester ?? undefined
  const gradeYearLevelFilter = args?.gradeYearLevel ?? undefined
  const sectionFilter = args?.section ?? undefined

  let teacherFilter = args?.teacher ?? undefined

  if (session.user.role === ROLE.TEACHER) {
    teacherFilter = session.user.teacherProfileId
  }

  const whereInput: Prisma.EnrollmentClassWhereInput = {
    schoolId: session?.user.schoolId,
    programOfferingId: programFilter,
    courseId: courseFilter,
    schoolYearId: schoolYearFilter,
    semesterId: semesterFilter,
    gradeYearLevelId: gradeYearLevelFilter,
    sectionId: sectionFilter,
  }

  const totalFilteredPromise = prisma.enrollmentClass.count({
    where: whereInput,
  })

  const pageSize = args.view === "list" ? DEFAULT_PAGE_SIZE : 16

  const enrollmentsPromise = prisma.enrollmentClass.findMany({
    where: whereInput,
    include: {
      gradeYearLevel: true,
      course: true,
      section: true,
      programOffering: true,
      schoolYear: true,
      semester: true,
      subjects: {
        where: { teacherId: teacherFilter },
        include: { subject: true, teacher: true },
      },
      _count: {
        select: { students: true },
      },
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: args?.pageSize ?? pageSize,
    skip: getSkip({ limit: pageSize, page: args?.page }),
  })

  const [totalFiltered, enrollments] = await Promise.all([
    totalFilteredPromise,
    enrollmentsPromise,
  ])

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize,
    itemCount: enrollments.length,
    totalPages: Math.ceil(totalFiltered / pageSize),
  }

  return {
    enrollments: teacherFilter
      ? enrollments.filter((e) => e.subjects.length > 0)
      : enrollments,
    pageInfo,
  }
}

async function getEnrollmentByIdCall(id: string) {
  const enrollment = await prisma.enrollmentClass.findUnique({
    where: { id },
    include: {
      gradeYearLevel: true,
      course: true,
      section: true,
      programOffering: true,
      schoolYear: true,
      semester: true,
      students: {
        orderBy: { lastName: "asc" },
      },
      subjects: {
        include: {
          subject: true,
          teacher: true,
        },
      },
    },
  })

  return enrollment
}

export const getEnrollmentById = cache(getEnrollmentByIdCall)

export async function getClassSubjectById(
  id: string,
  gradingPeriodId?: string
) {
  let gradingPeriodFilter = gradingPeriodId

  if (!gradingPeriodFilter) {
    const gradingPeriods = await prisma.classSubject.findUnique({
      where: { id },
      select: {
        enrollmentClass: {
          select: {
            gradingPeriods: { select: { id: true }, orderBy: { order: "asc" } },
          },
        },
      },
    })

    gradingPeriodFilter =
      gradingPeriods?.enrollmentClass.gradingPeriods.at(0)?.id
  }

  const classSubject = await prisma.classSubject.findUnique({
    where: { id },
    include: {
      subject: true,
      teacher: true,
      periodicGrades: {
        where: { gradingPeriodId: gradingPeriodFilter },
        include: {
          gradingPeriod: true,
          gradeComponents: {
            include: {
              subcomponents: {
                where: {
                  gradingPeriodId: gradingPeriodFilter,
                  classSubjectId: id,
                },
                orderBy: { order: "asc" },
              },
            },
          },
          student: { select: { id: true } },
        },
      },
      enrollmentClass: {
        include: {
          gradingPeriods: true,
          gradeYearLevel: true,
          course: true,
          section: true,
          programOffering: true,
          schoolYear: true,
          semester: true,
          students: {
            orderBy: { lastName: "asc" },
          },
        },
      },
    },
  })

  return classSubject
}

// export const getClassSubjectById = cache(getClassSubjectByIdCall)

export type DetailedClassSubject = NonNullable<
  Prisma.PromiseReturnType<typeof getClassSubjectById>
>
