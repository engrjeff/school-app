import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"
import {
  Student,
  SubjectGrade,
  SubjectGradeComponent,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"

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
        periodicGrades: {
          include: {
            gradeComponents: {
              include: {
                subcomponents: {
                  where: { classSubjectId: params.classSubjectId },
                },
              },
            },
            scores: { include: { subjectGradeComponent: true } },
            student: true,
          },
          orderBy: {
            student: {
              lastName: "asc",
            },
          },
        },
        enrollmentClass: {
          include: {
            programOffering: true,
            gradingPeriods: true,
            // gradingPeriods: {
            //   include: {
            //     subjectGrades: {
            //       include: {
            //         gradeComponents: {
            //           include: {
            //             subcomponents: {
            //               where: { classSubjectId: params.classSubjectId },
            //             },
            //           },
            //         },
            //         student: true,
            //         scores: { include: { subjectGradeComponent: true } },
            //       },
            //       orderBy: {
            //         student: {
            //           lastName: "asc",
            //         },
            //       },
            //     },
            //   },
            //   orderBy: {
            //     order: "asc",
            //   },
            // },
          },
        },
      },
    })

    const studentGradeMap = new Map<
      string,
      | Record<string, { id: string; title: string; grade: number }>
      | { student: Student }
    >()

    const gradingPeriods = classSubject?.enrollmentClass.gradingPeriods

    const gradeComponents =
      classSubject?.periodicGrades.at(0)?.gradeComponents ?? []

    gradingPeriods?.forEach((period) => {
      const periodicGrades = classSubject?.periodicGrades.filter(
        (grade) => grade.gradingPeriodId === period.id
      )

      periodicGrades?.forEach((sg) => {
        const periodicFinalGrade = getGrade(sg, gradeComponents, period.id)

        if (studentGradeMap.has(sg.studentId)) {
          studentGradeMap.set(sg.studentId, {
            ...studentGradeMap.get(sg.studentId),
            [period.id]: {
              id: period.id,
              title: period.title,
              grade: periodicFinalGrade.grade,
            },
            student: sg.student,
          })
        } else {
          studentGradeMap.set(sg.studentId, {
            [period.id]: {
              id: period.id,
              title: period.title,
              grade: periodicFinalGrade.grade,
            },
            student: sg.student,
          })
        }
      }, [])
    })
    //  const sum = grades.reduce((sum, grade) => (sum += grade), 0)

    //  const ave = sum / grades.length

    const subjectFinalGrades = Array.from(studentGradeMap.values()).map(
      (sg) => {
        const entries = Object.entries(sg)

        const sum = entries.reduce((subTotal, [key, val]) => {
          if (key === "student") return subTotal
          return subTotal + val.grade
        }, 0)

        const ave = sum / (entries.length - 1)

        return {
          ...sg,
          average: parseFloat(ave.toFixed(0)),
        }
      }
    )

    subjectFinalGrades.sort((a, b) => b.average - a.average)

    const heading = classSubject?.enrollmentClass.gradingPeriods.map((p) => ({
      id: p.id,
      title: p.title,
    }))

    return NextResponse.json({
      program: classSubject?.enrollmentClass.programOffering.code,
      heading,
      cells: subjectFinalGrades,
    })
  } catch (error) {
    console.log("Get Grade Summary Error: ", error)

    return NextResponse.json([])
  }
}

function getGrade(
  subjectGrade: SubjectGrade & { scores: SubjectGradeSubComponentScore[] },
  gradeComponents: Array<
    SubjectGradeComponent & { subcomponents: SubjectGradeSubComponent[] }
  >,
  periodId: string
) {
  const grade = gradeComponents.reduce((grade, gc) => {
    const maxTotal = gc.subcomponents
      .filter((sc) => sc.gradingPeriodId === periodId)
      .reduce((sum, part) => (sum += part.highestPossibleScore), 0)

    const gradeComponentScore = subjectGrade.scores
      .filter((s) => s.subjectGradeComponentId === gc.id && s.score !== null)
      .reduce((sum, score) => (sum += score.score!), 0)

    const weightedGradeComponentScore =
      (gradeComponentScore / maxTotal) * gc.percentage * 100

    return grade + weightedGradeComponentScore
  }, 0)

  return { studentId: subjectGrade.studentId, grade }
}
