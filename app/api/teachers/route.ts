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

    const teachers = await prisma.teacher.findMany({
      where: {
        schoolId: session?.user.schoolId,
        programs: programId
          ? {
              some: {
                id: programId,
              },
            }
          : undefined,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.log("Get Teachers in Program Error: ", error)

    return NextResponse.json([])
  }
}
