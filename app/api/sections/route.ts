import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const gradeYearLevelId = searchParams.get("gradeYearLevelId")

    const sections = await prisma.section.findMany({
      where: {
        schoolId: session?.user.schoolId,
        gradeYearLevelId: gradeYearLevelId ?? undefined,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.log("Get Sections Error: ", error)

    return NextResponse.json([])
  }
}
