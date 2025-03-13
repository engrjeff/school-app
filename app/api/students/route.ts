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
    const courseId = searchParams.get("courseId")
    const gradeYearLevelId = searchParams.get("gradeYearLevelId")
    const sectionId = searchParams.get("sectionId")
    const unenrolledOnly = searchParams.get("unenrolledOnly")

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
        status: unenrolledOnly ? StudentStatus.REGISTERED : undefined,
      },
      orderBy: { lastName: "asc" },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.log("Get Students Error: ", error)

    return NextResponse.json([])
  }
}
