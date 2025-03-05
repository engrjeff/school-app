"use client"

import {
  Gender,
  GradeComponentPartScore,
  Student,
  StudentGrade,
} from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getStudentGradesByGradingPeriod(gradingPeriodId: string) {
  const response = await apiClient.get<
    Array<
      StudentGrade & { student: Student; scores: GradeComponentPartScore[] }
    >
  >("/student-grades", {
    params: { gradingPeriodId },
  })
  return response.data
}

export function useStudentGrades(gender: Gender, gradingPeriodId?: string) {
  return useQuery({
    queryKey: ["student-grades", gradingPeriodId],
    queryFn: () => getStudentGradesByGradingPeriod(gradingPeriodId!),
    select(data) {
      return data.filter((d) => d.student.gender === gender)
    },
  })
}
