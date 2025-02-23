import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const programId = searchParams.get("programId")

    if (!programId) return NextResponse.json([])

    const faculties = await prisma.faculty.findMany({
      where: { programOfferingId: programId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(faculties)
  } catch (error) {
    console.log("Get Faculties Error: ", error)

    return NextResponse.json([])
  }
}
