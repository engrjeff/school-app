import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { classId: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.schoolId) return NextResponse.json(undefined)

    const gradingPeriods = await prisma.gradingPeriod.findMany({
      where: {
        classId: params.classId,
      },
      include: {
        class: { include: { programOffering: { select: { code: true } } } },
        gradeComponents: {
          include: { parts: true },
        },
        studentGrades: {
          include: {
            scores: {
              include: {
                gradeComponentPart: true,
                parentGradeComponent: true,
              },
            },
            student: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })

    const studentGradeMap = new Map()

    gradingPeriods.forEach((period) => {
      period.studentGrades.forEach((sg) => {
        const maxTotalScoreMap = new Map<string, number>()

        period.gradeComponents.forEach((gc) => {
          const maxTotal = gc.parts.reduce(
            (sum, part) => (sum += part.highestPossibleScore),
            0
          )

          maxTotalScoreMap.set(gc.id, maxTotal)
        })

        const grade = sg.scores.reduce((ws, score) => {
          return (ws +=
            (score.score /
              maxTotalScoreMap.get(score.parentGradeComponentId)!) *
            score.parentGradeComponent.percentage)
        }, 0)

        if (studentGradeMap.has(sg.studentId)) {
          studentGradeMap.set(sg.studentId, {
            ...studentGradeMap.get(sg.studentId),
            [period.title]: {
              id: period.id,
              title: period.title,
              grade: grade * 100,
            },
          })
        } else {
          studentGradeMap.set(sg.studentId, {
            [period.title]: {
              id: period.id,
              title: period.title,
              grade: grade * 100,
            },
            student: sg.student,
          })
        }
      }, [])
    })

    return NextResponse.json({
      program: gradingPeriods.at(0)?.class.programOffering.code,
      heading: gradingPeriods.map((p) => ({ id: p.id, title: p.title })),
      cells: Array.from(studentGradeMap.values()),
    })
  } catch (error) {
    console.log("Get Grade Summary Error: ", error)

    return NextResponse.json([])
  }
}
