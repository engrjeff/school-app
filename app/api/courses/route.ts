import { NextResponse } from "next/server"
import { auth } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const courses = await prisma.course.findMany({
      where: { schoolId: session?.user.schoolId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.log("Get Courses Error: ", error)

    return NextResponse.json([])
  }
}
