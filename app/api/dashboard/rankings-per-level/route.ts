import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/auth"
import {
  Gender,
  Student,
  SubjectGrade,
  SubjectGradeComponent,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

type StudentGradeMapValue = {
  subjectId: string
  subjectCode: string
  subjectName: string
  studentId: string
  studentName: string
  gender: Gender
  finalAverageGrade: number
  periodicFinalGrades: Array<{
    periodId: string
    periodName: string
    periodicGrade: number
  }>
}

type StudentSubjectsGradeMapValue = {
  studentId: string
  studentName: string
  sectionId: string
  sectionName: string
  gender: Gender
  allSubjectAverage: number
  subjectGrades: Array<{
    subjectId: string
    subjectCode: string
    subjectName: string
    finalGrade: number
    periodicFinalGrades: Array<{
      periodId: string
      periodName: string
      periodicGrade: number
    }>
  }>
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.schoolId) return NextResponse.json([])

    const searchParams = request.nextUrl.searchParams
    const programId = searchParams.get("programId") ?? undefined
    const schoolYearId = searchParams.get("schoolYearId") ?? undefined
    const semesterId = searchParams.get("semesterId") ?? undefined
    const courseId = searchParams.get("courseId") ?? undefined
    const gradeLevelId = searchParams.get("gradeLevelId") ?? undefined

    // get data for ranking students' final grade per section and per grade level
    // we need to get the enrollment classes with subjects for the given program,
    // then for each subject, we get the final grade of each student
    const enrollmentClasses = await prisma.enrollmentClass.findMany({
      where: {
        schoolId: session.user.schoolId,
        programOfferingId: programId,
        courseId: courseId,
        schoolYearId: schoolYearId,
        semesterId: semesterId,
        gradeYearLevelId: gradeLevelId,
      },
      include: {
        section: { select: { id: true, name: true } },
        subjects: {
          where: {
            NOT: {
              periodicGrades: {
                none: {},
              },
            },
          },
          include: {
            subject: true,
            periodicGrades: {
              include: {
                student: true,
                subject: { include: { subject: true } },
                scores: true,
                gradeComponents: { include: { subcomponents: true } },
              },
              orderBy: [{ student: { lastName: "asc" } }],
            },
          },
        },
        gradingPeriods: true,
      },
    })

    const studentSubjectGradesMap = new Map<
      string,
      StudentSubjectsGradeMapValue
    >()

    const data = enrollmentClasses.map(
      ({ subjects, gradingPeriods, ...enrollment }) => {
        const subjectsWithGrades = subjects.map((subject) => {
          const studentGradeMap = new Map<string, StudentGradeMapValue>()

          gradingPeriods.forEach((period) => {
            const periodicGrades = subject.periodicGrades.filter(
              (s) =>
                s.subjectId === subject.id && s.gradingPeriodId === period.id
            )

            return periodicGrades?.forEach((sg) => {
              const gradeComponents = sg.gradeComponents ?? []

              const periodicFinalGrade = getGrade(
                sg,
                gradeComponents,
                period.id
              )

              if (studentGradeMap.has(sg.studentId)) {
                const current = studentGradeMap.get(sg.studentId)
                if (current) {
                  studentGradeMap.set(sg.studentId, {
                    ...current,
                    finalAverageGrade:
                      current.finalAverageGrade +
                      periodicFinalGrade.grade / gradingPeriods.length,
                    periodicFinalGrades: [
                      ...current.periodicFinalGrades,
                      {
                        periodId: period.id,
                        periodName: period.title,
                        periodicGrade: periodicFinalGrade.grade,
                      },
                    ],
                  })
                }
              } else {
                studentGradeMap.set(sg.studentId, {
                  subjectId: sg.subject.subject.id,
                  subjectName: sg.subject.subject.title,
                  subjectCode: sg.subject.subject.code,
                  finalAverageGrade:
                    periodicFinalGrade.grade / gradingPeriods.length,
                  studentId: sg.studentId,
                  studentName: getStudentFullName(sg.student),
                  gender: sg.student.gender,
                  periodicFinalGrades: [
                    {
                      periodId: period.id,
                      periodName: period.title,
                      periodicGrade: periodicFinalGrade.grade,
                    },
                  ],
                })
              }
            })
          })

          const studentsSubjectGradeData = Array.from(studentGradeMap.values())

          studentsSubjectGradeData.forEach((ssg) => {
            if (studentSubjectGradesMap.has(ssg.studentId)) {
              const currentItem = studentSubjectGradesMap.get(ssg.studentId)

              if (currentItem) {
                studentSubjectGradesMap.set(currentItem.studentId, {
                  studentId: currentItem.studentId,
                  studentName: currentItem.studentName,
                  sectionId: enrollment.sectionId,
                  sectionName: enrollment.section.name,
                  gender: currentItem.gender,
                  allSubjectAverage:
                    currentItem.allSubjectAverage +
                    ssg.finalAverageGrade / subjects.length,
                  subjectGrades: [
                    ...currentItem.subjectGrades,
                    {
                      subjectId: ssg.subjectId,
                      subjectCode: ssg.subjectCode,
                      subjectName: ssg.studentName,
                      finalGrade: ssg.finalAverageGrade,
                      periodicFinalGrades: ssg.periodicFinalGrades,
                    },
                  ],
                })
              }
            } else {
              studentSubjectGradesMap.set(ssg.studentId, {
                studentId: ssg.studentId,
                studentName: ssg.studentName,
                sectionId: enrollment.sectionId,
                sectionName: enrollment.section.name,
                gender: ssg.gender,
                allSubjectAverage: ssg.finalAverageGrade / subjects.length,
                subjectGrades: [
                  {
                    subjectId: ssg.subjectId,
                    subjectCode: ssg.subjectCode,
                    subjectName: ssg.studentName,
                    finalGrade: ssg.finalAverageGrade,
                    periodicFinalGrades: ssg.periodicFinalGrades,
                  },
                ],
              })
            }
          })

          // this array is for a specific subject only
          const studentsArrayData = Array.from(studentGradeMap.values()).filter(
            (s) => s.finalAverageGrade !== 0
          )

          studentsArrayData.sort(
            (a, b) => b.finalAverageGrade - a.finalAverageGrade
          )

          return {
            subject: subject.subject.code,
            studentsWithGrades: studentsArrayData.slice(0, 10),
          }
        })

        return {
          enrollment: enrollment.id,
          section: enrollment.section.name,
          subjectsWithGrades,
        }
      }
    )

    const data2 = Array.from(studentSubjectGradesMap.values())

    data2.sort((a, b) => b.allSubjectAverage - a.allSubjectAverage)

    return NextResponse.json({
      rankingsPerSection: data,
      rankingsPerGradeLevel: data2.slice(0, 10),
    })
  } catch (error) {
    console.log("Get Rankings per level Error: ", error)

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
      .filter(
        (sc) =>
          sc.gradingPeriodId === periodId &&
          sc.classSubjectId === subjectGrade.subjectId
      )
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

function getStudentFullName(student: Student) {
  return `${student.lastName}, ${student.firstName} ${student.middleName} ${student.suffix}`
}
