"use server"

import { cache } from "react"
import { getSession } from "@/auth"
import {
  Class,
  Course,
  GradeYearLevel,
  Prisma,
  ProgramOffering,
  ROLE,
  SchoolYear,
  Section,
  Semester,
  Student,
  Subject,
  Teacher,
} from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

interface DetailedClass extends Class {
  schoolYear: SchoolYear
  semester: Semester
  programOffering: ProgramOffering
  course: Course
  gradeYearLevel: GradeYearLevel
  section: Section
  subject: Subject
  teacher: Teacher
  students: Student[]
}

export type GetClassesArgs = {
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

function getSort(sort?: string, order?: "asc" | "desc") {
  if (sort === "schoolYear")
    return {
      schoolYear: {
        title: order,
      },
    }

  if (sort === "semester")
    return {
      semester: {
        title: order,
      },
    }

  if (sort === "program")
    return {
      programOffering: {
        title: order,
      },
    }

  if (sort === "course")
    return {
      course: {
        title: order,
      },
    }

  if (sort === "gradeSection")
    return {
      gradeYearLevel: {
        level: order,
      },
    }

  if (sort === "teacher")
    return {
      teacher: {
        lastName: order,
      },
    }
  if (sort === "student_count")
    return {
      students: {
        _count: order,
      },
    }

  return {
    createdAt: "asc",
  }
}

async function getClassesCall(args: GetClassesArgs) {
  const session = await getSession()

  if (!session?.user.schoolId) return { classes: [] as DetailedClass[] }

  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args?.program ?? undefined
  const courseFilter = args?.course ?? undefined
  const schoolYearFilter = args?.schoolYear ?? undefined
  const semesterFilter = args?.semester ?? undefined
  const gradeYearLevelFilter = args?.gradeYearLevel ?? undefined
  const sectionFilter = args?.section ?? undefined

  let teacherFilter = args.teacher ? args.teacher : undefined

  if (session.user?.role === ROLE.TEACHER) {
    // get the teacherProfileId of user
    const userTeacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
    })

    teacherFilter = userTeacher?.id
  }

  const whereInput: Prisma.ClassWhereInput = {
    schoolId: session?.user.schoolId,
    programOfferingId: programFilter,
    courseId: courseFilter,
    schoolYearId: schoolYearFilter,
    semesterId: semesterFilter,
    teacherId: teacherFilter,
    gradeYearLevelId: gradeYearLevelFilter,
    sectionId: sectionFilter,
  }

  const totalFilteredPromise = prisma.class.count({
    where: whereInput,
  })

  const pageSize = args.view === "list" ? DEFAULT_PAGE_SIZE : 16

  const classesPromise = prisma.class.findMany({
    where: whereInput,
    include: {
      gradeYearLevel: true,
      course: true,
      teacher: true,
      subject: true,
      section: true,
      programOffering: true,
      schoolYear: true,
      semester: true,
      students: true,
    },
    // @ts-expect-error nah
    orderBy: getSort(sortKey, sortOrder),
    take: args?.pageSize ?? pageSize,
    skip: getSkip({ limit: pageSize, page: args?.page }),
  })

  const [totalFiltered, classes] = await Promise.all([
    totalFilteredPromise,
    classesPromise,
  ])

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize,
    itemCount: classes.length,
    totalPages: Math.ceil(totalFiltered / pageSize),
  }

  return {
    classes: classes as DetailedClass[],
    pageInfo,
  }
}

export const getClasses = cache(getClassesCall)

async function getSchoolClassByIdCall(classId: string) {
  const schoolClass = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      gradeYearLevel: true,
      course: true,
      teacher: true,
      subject: true,
      section: true,
      programOffering: true,
      schoolYear: true,
      semester: true,
      students: true,
      gradingPeriods: {
        include: {
          gradeComponents: {
            include: {
              parts: {
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  })

  return schoolClass
}

export const getSchoolClassById = cache(getSchoolClassByIdCall)
