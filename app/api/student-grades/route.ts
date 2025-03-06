import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    if (!session?.user?.teacherProfileId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const gradingPeriodId = searchParams.get("gradingPeriodId")

    const studentGrades = await prisma.studentGrade.findMany({
      where: {
        gradingPeriodId: gradingPeriodId ?? undefined,
      },
      include: { student: true, scores: true },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(studentGrades)
  } catch (error) {
    console.log("Get Student Grades by Grading Period Error: ", error)

    return NextResponse.json([])
  }
}
