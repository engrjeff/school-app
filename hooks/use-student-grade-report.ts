"use client"

import { Gender, School } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

export interface GetStudentGradeReportArgs {
  enrollmentId: string
}

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

export type StudentSubjectsGradeMapValue = {
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

export interface StudentGradeReportQueryResponse {
  school: School
  enrollment: {
    id: string
    schoolYear: string
    semester: string
    course: string
    programOffering: string
    gradeLevel: string
    section: string
  }
  studentGradesPerSection: Array<{
    enrollment: string
    section: string
    subjectsWithGrades: {
      subject: string
      studentsWithGrades: StudentGradeMapValue[]
    }[]
  }>
  studentsGradesReport: Array<StudentSubjectsGradeMapValue>
}

async function getStudentGradeReport(args: GetStudentGradeReportArgs) {
  const response = await apiClient.get<StudentGradeReportQueryResponse>(
    "/student-grade-report",
    {
      params: args,
    }
  )
  return response.data
}

export function useStudentGradeReport({
  enrollmentId,
}: GetStudentGradeReportArgs) {
  return useQuery({
    queryKey: ["student-grade-report", enrollmentId],
    queryFn: () =>
      getStudentGradeReport({
        enrollmentId,
      }),
    enabled: Boolean(enrollmentId),
  })
}
