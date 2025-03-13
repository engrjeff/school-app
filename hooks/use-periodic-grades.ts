"use client"

import { useParams } from "next/navigation"
import {
  Student,
  SubjectGrade,
  SubjectGradeComponent,
  SubjectGradeSubComponent,
  SubjectGradeSubComponentScore,
} from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

export interface PeriodicGrade extends SubjectGrade {
  student: Student
  scores: SubjectGradeSubComponentScore[]
}

export interface PeriodicGradeComponents extends SubjectGradeComponent {
  subcomponents: SubjectGradeSubComponent[]
}

async function getPeriodicGradesByGradingPeriod(
  classSubjectId: string,
  gradingPeriodId: string
) {
  const response = await apiClient.get<{
    periodicGrades: PeriodicGrade[]
    gradeComponents: PeriodicGradeComponents[]
  }>("/periodic-grades", {
    params: { classSubjectId, gradingPeriodId },
  })
  return response.data
}

export function usePeriodicGrades(gradingPeriodId: string) {
  const { id: classSubjectId } = useParams<{ id: string }>() // id of class subject

  return useQuery({
    queryKey: ["periodic-grades", gradingPeriodId, classSubjectId],
    queryFn: () =>
      getPeriodicGradesByGradingPeriod(classSubjectId, gradingPeriodId!),
  })
}
