import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get("courseId")
    const gradeYearLevelId = searchParams.get("gradeYearLevelId")
    const sectionId = searchParams.get("sectionId")

    const students = await prisma.student.findMany({
      where: {
        schoolId: session?.user.schoolId,
        currentCourseId: courseId,
        currentGradeYearLevelId: gradeYearLevelId,
        OR: [
          {
            currentSectionId: null,
          },
          {
            currentSectionId: sectionId,
          },
        ],
      },
      orderBy: { lastName: "asc" },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.log("Get Students Error: ", error)

    return NextResponse.json([])
  }
}
