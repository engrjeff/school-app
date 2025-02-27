import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const schoolYearId = searchParams.get("schoolYearId")

    const semesters = await prisma.semester.findMany({
      where: {
        schoolYearId: schoolYearId ?? undefined,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(semesters)
  } catch (error) {
    console.log("Get Semesters Error: ", error)

    return NextResponse.json([])
  }
}
