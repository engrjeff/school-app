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

    const schoolYears = await prisma.schoolYear.findMany({
      where: {
        schoolId: session?.user.schoolId,
        programOfferingId: programId ?? undefined,
      },
      include: { semesters: true },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(schoolYears)
  } catch (error) {
    console.log("Get School Years Error: ", error)

    return NextResponse.json([])
  }
}
