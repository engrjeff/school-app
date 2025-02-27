"use client"

import { Subject } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getSubjects(courseId?: string) {
  const response = await apiClient.get<Subject[]>("/subjects", {
    params: { courseId: courseId },
  })
  return response.data
}

export function useSubjects(courseId?: string) {
  return useQuery({
    queryKey: ["subjects", courseId],
    queryFn: () => getSubjects(courseId),
  })
}
