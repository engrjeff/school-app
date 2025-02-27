"use client"

import { Student } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getStudents(
  courseId?: string,
  gradeYearLevelId?: string,
  sectionId?: string
) {
  if (!courseId || !gradeYearLevelId) return []

  const response = await apiClient.get<Student[]>("/students", {
    params: { courseId, gradeYearLevelId, sectionId },
  })
  return response.data
}

export function useStudents(
  courseId?: string,
  gradeYearLevelId?: string,
  sectionId?: string
) {
  return useQuery({
    queryKey: ["students", courseId, gradeYearLevelId, sectionId],
    queryFn: () => getStudents(courseId, gradeYearLevelId, sectionId),
    enabled: Boolean(courseId) && Boolean(gradeYearLevelId),
  })
}
