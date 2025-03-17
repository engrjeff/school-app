"use client"

import { useSearchParams } from "next/navigation"
import { Gender } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

interface GetRankingsArgs {
  courseId?: string
  gradeLevelId?: string
  programId: string
  schoolYearId: string
  semesterId: string
}

interface UseRankingsArgs {
  courseId?: string
  gradeLevelId?: string
}

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

export interface RankingsQueryResponse {
  rankingsPerSection: Array<{
    enrollment: string
    section: string
    subjectsWithGrades: {
      subject: string
      studentsWithGrades: StudentGradeMapValue[]
    }[]
  }>
  rankingsPerGradeLevel: Array<StudentSubjectsGradeMapValue>
}

async function getRankings(args: GetRankingsArgs) {
  const response = await apiClient.get<RankingsQueryResponse>(
    "/dashboard/rankings-per-level",
    {
      params: args,
    }
  )
  return response.data
}

export function useRankings({ courseId, gradeLevelId }: UseRankingsArgs) {
  const searchParams = useSearchParams()

  const programId = searchParams.get("program")!
  const schoolYearId = searchParams.get("schoolYear")!
  const semesterId = searchParams.get("semester")!

  return useQuery({
    queryKey: [
      "rankings-per-level",
      programId,
      schoolYearId,
      semesterId,
      courseId,
      gradeLevelId,
    ],
    queryFn: () =>
      getRankings({
        programId,
        schoolYearId,
        semesterId,
        courseId,
        gradeLevelId,
      }),
    enabled:
      Boolean(programId) &&
      Boolean(schoolYearId) &&
      Boolean(semesterId) &&
      Boolean(courseId) &&
      Boolean(gradeLevelId),
  })
}
