import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get("courseId")

    const subjects = await prisma.subject.findMany({
      where: {
        schoolId: session?.user.schoolId,
        courseId: courseId ?? undefined,
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.log("Get Subjects Error: ", error)

    return NextResponse.json([])
  }
}
