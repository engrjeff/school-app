import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get("courseId")

    if (!courseId) return NextResponse.json([])

    const gradeLevels = await prisma.gradeYearLevel.findMany({
      where: { courseId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(gradeLevels)
  } catch (error) {
    console.log("Get Grade/Year Levels Error: ", error)

    return NextResponse.json([])
  }
}
