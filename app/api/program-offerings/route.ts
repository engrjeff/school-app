import { NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const courses = await prisma.programOffering.findMany({
      where: { schoolId: session?.user.schoolId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.log("Get Program Offerings Error: ", error)

    return NextResponse.json([])
  }
}
