import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { classSubjectId: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json(undefined)

    const classSubject = await prisma.classSubject.findUnique({
      where: { id: params.classSubjectId },
      include: {
        enrollmentClass: {
          include: {
            programOffering: true,
            gradingPeriods: {
              include: {
                subjectGrades: {
                  include: {
                    gradeComponents: { include: { subcomponents: true } },
                    student: true,
                    scores: { include: { subjectGradeComponent: true } },
                  },
                  orderBy: {
                    student: {
                      lastName: "asc",
                    },
                  },
                },
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    })

    const studentGradeMap = new Map()

    classSubject?.enrollmentClass.gradingPeriods.forEach((period) => {
      period.subjectGrades.forEach((sg) => {
        const maxTotalScoreMap = new Map<string, number>()

        sg.gradeComponents.forEach((gc) => {
          const maxTotal = gc.subcomponents.reduce(
            (sum, part) => (sum += part.highestPossibleScore),
            0
          )

          maxTotalScoreMap.set(gc.id, maxTotal)
        })

        const grade = sg.scores.reduce((ws, score) => {
          if (!score.score) return ws

          return (ws +=
            (score.score /
              maxTotalScoreMap.get(score.subjectGradeComponentId)!) *
            score.subjectGradeComponent.percentage)
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
      program: classSubject?.enrollmentClass.programOffering.code,
      heading: classSubject?.enrollmentClass.gradingPeriods.map((p) => ({
        id: p.id,
        title: p.title,
      })),
      cells: Array.from(studentGradeMap.values()),
    })
  } catch (error) {
    console.log("Get Grade Summary Error: ", error)

    return NextResponse.json([])
  }
}
