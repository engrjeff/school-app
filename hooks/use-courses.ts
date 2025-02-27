"use client"

import { Course } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getCourses(programId?: string) {
  const response = await apiClient.get<Course[]>("/courses", {
    params: { programId: programId },
  })
  return response.data
}

export function useCourses(programId?: string) {
  return useQuery({
    queryKey: ["courses", programId],
    queryFn: () => getCourses(programId),
  })
}
