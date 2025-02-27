"use client"

import { Semester } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getSemesters(schoolYearId: string) {
  const response = await apiClient.get<Semester[]>("/semesters", {
    params: { schoolYearId },
  })
  return response.data
}

export function useSemesters(schoolYearId: string) {
  return useQuery({
    queryKey: ["semesters", schoolYearId],
    queryFn: () => getSemesters(schoolYearId!),
    enabled: Boolean(schoolYearId),
  })
}
