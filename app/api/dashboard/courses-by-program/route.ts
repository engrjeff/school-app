import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const programId = searchParams.get("programId")
    const schoolYearId = searchParams.get("schoolYearId")

    const courses = await prisma.course.findMany({
      where: {
        schoolId: session?.user.schoolId,
        programOfferingId: programId ?? undefined,
      },
      include: {
        enrolledClasses: {
          where: { schoolYearId: schoolYearId ?? undefined },
          include: {
            students: {
              select: {
                id: true,
                gender: true,
                currentGradeYearLevel: {
                  select: { id: true, displayName: true, level: true },
                },
              },
            },
          },
        },
        gradeYearLevels: true,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(
      courses.map(({ enrolledClasses, gradeYearLevels, ...course }) => {
        return {
          ...course,
          gradeYearLevels,
          students: enrolledClasses.map((e) => e.students).flat(),
        }
      })
    )
  } catch (error) {
    console.log("Dashboard: Get Courses of Program Error: ", error)

    return NextResponse.json([])
  }
}
