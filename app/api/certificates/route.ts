import { NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const certificates = await prisma.certificateTemplate.findMany({
      where: { schoolId: session?.user?.schoolId },
      include: {
        school: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.log("Get Certificate Templates Error: ", error)

    return NextResponse.json([])
  }
}
