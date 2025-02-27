"use client"

import { Section } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getSections(gradeYearLevelId?: string) {
  const response = await apiClient.get<Section[]>("/sections", {
    params: { gradeYearLevelId: gradeYearLevelId },
  })
  return response.data
}

export function useSections(gradeYearLevelId?: string) {
  return useQuery({
    queryKey: ["sections", gradeYearLevelId],
    queryFn: () => getSections(gradeYearLevelId),
  })
}
