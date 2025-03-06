import { NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    if (!session?.user?.teacherProfileId) return NextResponse.json([])

    const gradeComponents = await prisma.gradeComponent.findMany({
      where: {
        teacherId: session?.user.teacherProfileId,
      },
      include: {
        parts: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(gradeComponents)
  } catch (error) {
    console.log("Get Grade Components Error: ", error)

    return NextResponse.json([])
  }
}
