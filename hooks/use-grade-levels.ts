"use client"

import { GradeYearLevel } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getGradeLevels(courseId: string) {
  const response = await apiClient.get<GradeYearLevel[]>("/grade-year-levels", {
    params: { courseId },
  })
  return response.data
}

export function useGradeYearLevels(courseId?: string) {
  return useQuery({
    queryKey: ["gradeyearlevels", courseId],
    queryFn: () => getGradeLevels(courseId!),
    enabled: Boolean(courseId),
  })
}
