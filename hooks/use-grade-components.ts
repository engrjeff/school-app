"use client"

import { GradeComponent, GradeComponentPart } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getGradeComponents() {
  const response =
    await apiClient.get<
      Array<GradeComponent & { parts: GradeComponentPart[] }>
    >("/grade-components")
  return response.data
}

export function useGradeComponents() {
  return useQuery({
    queryKey: ["grade-components"],
    queryFn: getGradeComponents,
  })
}
