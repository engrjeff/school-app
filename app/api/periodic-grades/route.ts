import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const gradingPeriodId = searchParams.get("gradingPeriodId")
    const classSubjectId = searchParams.get("classSubjectId")

    const firstSubjectGradeCall = prisma.subjectGrade.findFirst({
      where: {
        gradingPeriodId: gradingPeriodId ?? undefined,
        subjectId: classSubjectId ?? undefined,
      },
      select: {
        gradeComponents: {
          select: {
            id: true,
            label: true,
            title: true,
            percentage: true,
            subcomponents: {
              where: {
                classSubjectId: classSubjectId!,
                gradingPeriodId: gradingPeriodId ?? undefined,
              },
              select: {
                id: true,
                gradeComponentId: true,
                highestPossibleScore: true,
                title: true,
                order: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    })

    const periodicGradesCall = prisma.subjectGrade.findMany({
      where: {
        gradingPeriodId: gradingPeriodId ?? undefined,
        subjectId: classSubjectId ?? undefined,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            suffix: true,
            gender: true,
          },
        },
        scores: {
          select: {
            id: true,
            score: true,
            subjectGradeId: true,
            subjectGradeComponentId: true,
            subjectGradeSubComponentId: true,
          },
        },
        // gradeComponents: {
        //   select: {
        //     id: true,
        //     label: true,
        //     title: true,
        //     percentage: true,
        //     subcomponents: {
        //       select: {
        //         id: true,
        //         gradeComponentId: true,
        //         highestPossibleScore: true,
        //         title: true,
        //         order: true,
        //       },
        //       where: { gradingPeriodId: gradingPeriodId ?? undefined },
        //       orderBy: { order: "asc" },
        //     },
        //   },
        // },
      },
      orderBy: { student: { lastName: "asc" } },
    })

    const [periodicGrades, firstSubjectGrade] = await Promise.all([
      periodicGradesCall,
      firstSubjectGradeCall,
    ])

    return NextResponse.json({
      periodicGrades,
      gradeComponents: firstSubjectGrade?.gradeComponents ?? [],
    })
  } catch (error) {
    console.log("Get Periodic Grades by Grading Period Error: ", error)

    return NextResponse.json([])
  }
}
