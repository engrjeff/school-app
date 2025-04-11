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
import { differenceInYears } from "date-fns"
import { groupBy } from "remeda"

import prisma from "@/lib/db"

export const dynamic = "force-dynamic"

type StudentGradeMapValue = {
  subjectId: string
  subjectCode: string
  subjectName: string
  studentId: string
  studentName: string
  studentNumber: string
  studentAge: number
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
  studentNumber: string
  studentAge: number
  sectionId: string
  sectionName: string
  gender: Gender
  allSubjectAverage: number
  allSubjectPeriodicAverages: Array<{
    periodId: string
    periodName: string
    periodicAverage: number
  }>
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

    const enrollmentId = searchParams.get("enrollmentId") ?? undefined

    // get data for ranking students' final grade per section and per grade level
    // we need to get the enrollment classes with subjects for the given program,
    // then for each subject, we get the final grade of each student
    const enrollmentClass = await prisma.enrollmentClass.findUnique({
      where: {
        schoolId: session.user.schoolId,
        id: enrollmentId,
      },
      include: {
        section: { select: { id: true, name: true } },
        schoolYear: { select: { title: true } },
        semester: { select: { title: true } },
        course: { select: { title: true } },
        programOffering: { select: { title: true } },
        gradeYearLevel: { select: { displayName: true, level: true } },
        school: true,
        subjects: {
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

    const subjectsWithoutGradesYet = enrollmentClass?.subjects.filter(
      (subject) => subject.periodicGrades.length === 0
    )

    const subjectsWithGrades = enrollmentClass?.subjects.map((subject) => {
      const studentGradeMap = new Map<string, StudentGradeMapValue>()

      enrollmentClass?.gradingPeriods.forEach((period) => {
        const periodicGrades = subject.periodicGrades.filter(
          (s) => s.subjectId === subject.id && s.gradingPeriodId === period.id
        )

        periodicGrades?.forEach((sg) => {
          const gradeComponents = sg.gradeComponents ?? []

          const periodicFinalGrade = getGrade(sg, gradeComponents, period.id)

          if (studentGradeMap.has(sg.studentId)) {
            const current = studentGradeMap.get(sg.studentId)
            if (current) {
              studentGradeMap.set(sg.studentId, {
                ...current,
                finalAverageGrade:
                  current.finalAverageGrade +
                  periodicFinalGrade.grade /
                    enrollmentClass?.gradingPeriods.length,
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
                periodicFinalGrade.grade /
                enrollmentClass?.gradingPeriods.length,
              studentId: sg.studentId,
              studentName: getStudentFullName(sg.student),
              studentNumber: sg.student.studentId,
              studentAge: differenceInYears(new Date(), sg.student.birthdate!),
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
              studentNumber: currentItem.studentNumber,
              studentAge: currentItem.studentAge,
              sectionId: enrollmentClass.sectionId,
              sectionName: enrollmentClass.section.name,
              gender: currentItem.gender,
              allSubjectPeriodicAverages: [],
              allSubjectAverage:
                currentItem.allSubjectAverage +
                ssg.finalAverageGrade / enrollmentClass?.subjects.length,
              subjectGrades: [
                ...currentItem.subjectGrades,
                {
                  subjectId: ssg.subjectId,
                  subjectCode: ssg.subjectCode,
                  subjectName: ssg.subjectName,
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
            studentNumber: ssg.studentNumber,
            studentAge: ssg.studentAge,
            sectionId: enrollmentClass.sectionId,
            sectionName: enrollmentClass.section.name,
            gender: ssg.gender,
            allSubjectAverage:
              ssg.finalAverageGrade / enrollmentClass?.subjects.length,
            allSubjectPeriodicAverages: [],
            subjectGrades: [
              {
                subjectId: ssg.subjectId,
                subjectCode: ssg.subjectCode,
                subjectName: ssg.subjectName,
                finalGrade: ssg.finalAverageGrade,
                periodicFinalGrades: ssg.periodicFinalGrades,
              },
              ...(subjectsWithoutGradesYet?.map((subject) => ({
                subjectId: subject.subjectId,
                subjectCode: subject.subject.code,
                subjectName: subject.subject.title,
                finalGrade: 0,
                periodicFinalGrades: enrollmentClass?.gradingPeriods.map(
                  (period) => ({
                    periodId: period.id,
                    periodName: period.title,
                    periodicGrade: 0,
                  })
                ),
              })) ?? []),
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
        studentsWithGrades: studentsArrayData,
      }
    })

    const data2 = Array.from(studentSubjectGradesMap.values())

    data2.sort((a, b) => b.allSubjectAverage - a.allSubjectAverage)

    const data = {
      enrollment: enrollmentClass?.id,
      section: enrollmentClass?.section.name,
      subjectsWithGrades,
    }

    data2.forEach((d) => {
      const subjectsPeriodicGrades = d.subjectGrades
        .map((s) => s.periodicFinalGrades)
        .flat()

      const groupedByPeriod = groupBy(subjectsPeriodicGrades, (i) => i.periodId)

      const periodicAverage = Object.entries(groupedByPeriod).map(
        ([periodId, periodicGrades]) => {
          const total = periodicGrades.reduce(
            (sum, grade) => sum + grade.periodicGrade,
            0
          )
          return {
            periodId,
            periodName: periodicGrades?.at(0)?.periodName as string,
            periodicAverage: total / periodicGrades.length,
          }
        }
      )

      d.allSubjectPeriodicAverages = periodicAverage
    })

    return NextResponse.json({
      enrollment: {
        id: enrollmentClass?.id,
        schoolYear: enrollmentClass?.schoolYear.title,
        semester: enrollmentClass?.semester.title,
        course: enrollmentClass?.course.title,
        programOffering: enrollmentClass?.programOffering.title,
        gradeLevel:
          enrollmentClass?.gradeYearLevel.displayName +
          " " +
          enrollmentClass?.gradeYearLevel.level,
        section: enrollmentClass?.section.name,
      },
      school: enrollmentClass?.school,
      studentGradesPerSection: data,
      studentsGradesReport: data2,
    })
  } catch (error) {
    console.log("Get Students Grade Report Error: ", error)

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
  return `${student.lastName}, ${student.firstName} ${student.middleName} ${student.suffix ?? ""}`
}
