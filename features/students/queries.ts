"use server"

import { cache } from "react"
import { getSession } from "@/auth"
import {
  Class,
  Course,
  GradeYearLevel,
  Prisma,
  ProgramOffering,
  SchoolYear,
  Section,
  Semester,
  Student,
  Subject,
  Teacher,
} from "@prisma/client"

import prisma from "@/lib/db"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, getSkip } from "@/lib/server"

export type GetStudentsArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  course?: string
  program?: string
  gradeYearLevel?: string
  section?: string
}

export async function getStudentsOfCurrentSchool(args: GetStudentsArgs) {
  const session = await getSession()

  if (!session?.user.schoolId) return { students: [] }

  const sortKey = args?.sort ?? "lastName"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args?.program ? args.program : undefined
  const courseFilter = args?.course ? args.course.split(",") : undefined
  const gradeYearLevelFilter = args?.gradeYearLevel
    ? args.gradeYearLevel
    : undefined
  const sectionFilter = args?.section ? args.section : undefined

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
    currentCourse: {
      id: {
        in: courseFilter,
      },
      programOfferingId: programFilter,
    },
    currentGradeYearLevelId: gradeYearLevelFilter,
    currentSectionId: sectionFilter,
  }

  const totalFilteredPromise = prisma.student.count({
    where: whereInput,
  })

  const studentsPromise = prisma.student.findMany({
    where: whereInput,
    include: {
      currentCourse: true,
      currentGradeYearLevel: true,
      currentSection: true,
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const [totalFiltered, students] = await Promise.all([
    totalFilteredPromise,
    studentsPromise,
  ])

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

export async function getStudentById(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      currentCourse: true,
      currentGradeYearLevel: true,
      currentSection: true,
      enrollmentClasses: {
        orderBy: { createdAt: "asc" },
        include: {
          subjects: {
            include: { subject: true, teacher: true },
          },
          schoolYear: true,
          semester: true,
          gradeYearLevel: true,
          section: true,
          course: true,
        },
      },
    },
  })

  return { student }
}

export async function getStudentsOfTeacher(args: GetStudentsArgs) {
  const session = await getSession()

  if (!session?.user.schoolId) return { students: [] }

  const sortKey = args?.sort ?? "lastName"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const programFilter = args?.program ? args.program : undefined
  const courseFilter = args?.course ? args.course.split(",") : undefined

  const userTeacher = await prisma.teacher.findUnique({
    where: { userId: session.user.id },
    include: { classes: true },
  })

  const whereInput: Prisma.StudentWhereInput = {
    schoolId: session?.user.schoolId,
    enrollmentClasses: {
      some: {
        subjects: {
          some: {
            teacherId: userTeacher?.id,
          },
        },
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
            studentId: {
              contains: args.q,
              mode: "insensitive",
            },
          },
        ]
      : undefined,
    currentCourse: {
      id: {
        in: courseFilter,
      },
      programOfferingId: programFilter,
    },
  }

  const totalFilteredPromise = prisma.student.count({
    where: whereInput,
  })

  const studentsPromise = prisma.student.findMany({
    where: whereInput,
    include: {
      currentCourse: true,
      currentGradeYearLevel: true,
    },
    orderBy: {
      [sortKey]: sortOrder,
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const [totalFiltered, students] = await Promise.all([
    totalFilteredPromise,
    studentsPromise,
  ])

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

export type GetStudentClassesArgs = {
  q?: string
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  schoolYear?: string
  semester?: string
  gradeYearLevel?: string
  section?: string
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

interface DetailedClass extends Class {
  schoolYear: SchoolYear
  semester: Semester
  gradeYearLevel: GradeYearLevel
  section: Section
  subject: Subject
  teacher: Teacher
}

async function getClassesOfStudentCall(
  studentId: string,
  args: GetStudentClassesArgs
) {
  const sortKey = args?.sort ?? "createdAt"
  const sortOrder = (args?.order ?? "asc") as "asc" | "desc"

  const schoolYearFilter = args?.schoolYear ?? undefined
  const semesterFilter = args?.semester ?? undefined
  const gradeYearLevelFilter = args?.gradeYearLevel ?? undefined
  const sectionFilter = args?.section ?? undefined

  const classWhereInput: Prisma.ClassWhereInput = {
    schoolYearId: schoolYearFilter,
    semesterId: semesterFilter,
    gradeYearLevelId: gradeYearLevelFilter,
    sectionId: sectionFilter,
  }

  const totalFilteredPromise = prisma.student.findUnique({
    where: { id: studentId },
    select: {
      _count: { select: { classes: { where: classWhereInput } } },
    },
  })

  const studentPromise = prisma.student.findUnique({
    where: {
      id: studentId,
    },
    include: {
      currentCourse: { include: { programOffering: true } },
      classes: {
        where: classWhereInput,
        include: {
          programOffering: true,
          course: true,
          schoolYear: true,
          semester: true,
          gradeYearLevel: true,
          section: true,
          subject: true,
          teacher: true,
        },
        // @ts-expect-error nah
        orderBy: getSort(sortKey, sortOrder),
        take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
        skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
      },
    },
  })

  const [totalFiltered, studentRes] = await Promise.all([
    totalFilteredPromise,
    studentPromise,
  ])

  const student = studentRes as Student & {
    currentCourse: Course & { programOffering: ProgramOffering }
    classes: DetailedClass[]
  }

  const classesLen = student.classes.length

  const pageInfo = {
    total: totalFiltered?._count.classes ?? 0,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: classesLen,
    totalPages: Math.ceil(classesLen / DEFAULT_PAGE_SIZE),
  }

  return {
    student,
    pageInfo,
  }
}

export const getClassesOfStudent = cache(getClassesOfStudentCall)
