"use client"

import { useParams } from "next/navigation"
import { Student } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

export type GradeSummary = {
  program: string
  heading: Array<{ id: string; title: string }>
  cells: Array<
    {
      [key: string]: { grade: number; id: string; title: string }
    } & {
      student: Student
    }
  >
}

async function getGradeSummary(classSubjectId?: string) {
  const response = await apiClient.get<GradeSummary>(
    `/grade-summary/${classSubjectId}`
  )
  return response.data
}

export function useGradeSummary() {
  const { id: classSubjectId } = useParams<{ id: string }>()

  return useQuery({
    queryKey: ["grade-summary", classSubjectId],
    queryFn: () => getGradeSummary(classSubjectId),
  })
}
