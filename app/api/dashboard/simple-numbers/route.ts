import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"
import { StudentStatus } from "@prisma/client"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const schoolYearId = searchParams.get("schoolYearId") ?? undefined
    const semesterId = searchParams.get("semesterId") ?? undefined

    const simpleNumbers = await prisma.school.findUnique({
      where: { id: session.user.schoolId },
      select: {
        students: { select: { id: true } },
        enrolledClasses: {
          where: { schoolYearId, semesterId },
          select: {
            schoolYear: {
              select: { title: true },
            },
            semester: {
              select: { title: true },
            },
          },
          take: 1,
        },
        _count: {
          select: {
            enrolledClasses: {
              where: { schoolYearId, semesterId },
            },
            students: {
              where: { status: StudentStatus.ENROLLED },
            },
            teachers: true,
            programOfferings: true,
            courses: true,
            faculties: true,
          },
        },
      },
    })
    const sy = simpleNumbers?.enrolledClasses?.at(0)?.schoolYear?.title
    const sem = simpleNumbers?.enrolledClasses?.at(0)?.semester?.title

    return NextResponse.json({
      ...simpleNumbers?._count,
      schoolYear: sy
        ? `for S.Y ${sy}, ${sem}`
        : simpleNumbers?._count.enrolledClasses === 0
          ? "enrollments so far"
          : "all school years.",
      allStudents: simpleNumbers?.students.length,
    })
  } catch (error) {
    console.log("Dashboard: Get Simple Numbers by School: ", error)

    return NextResponse.json([])
  }
}
