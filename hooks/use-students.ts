"use client"

import { Student } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getStudents(
  courseId?: string,
  gradeYearLevelId?: string,
  sectionId?: string,
  unenrolledOnly?: boolean
) {
  if (!courseId || !gradeYearLevelId) return []

  const response = await apiClient.get<Student[]>("/students", {
    params: { courseId, gradeYearLevelId, sectionId, unenrolledOnly },
  })
  return response.data
}

export function useStudents(
  courseId?: string,
  gradeYearLevelId?: string,
  sectionId?: string,
  unenrolledOnly?: boolean
) {
  return useQuery({
    queryKey: [
      "students",
      courseId,
      gradeYearLevelId,
      sectionId,
      unenrolledOnly,
    ],
    queryFn: () =>
      getStudents(courseId, gradeYearLevelId, sectionId, unenrolledOnly),
    enabled: Boolean(courseId) && Boolean(gradeYearLevelId),
  })
}
