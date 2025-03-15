"use client"

import { useSearchParams } from "next/navigation"
import { Course, GradeYearLevel, Student } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

interface DetailedCourse extends Course {
  students: Array<
    Pick<Student, "id" | "gender"> & { currentGradeYearLevel: GradeYearLevel }
  >
  gradeYearLevels: GradeYearLevel[]
}

async function getCoursesOfProgram(
  programId?: string,
  schoolYearId?: string,
  semesterId?: string
) {
  const response = await apiClient.get<DetailedCourse[]>(
    "/dashboard/courses-by-program",
    {
      params: { programId, schoolYearId, semesterId },
    }
  )
  return response.data
}

export function useCoursesByProgram() {
  const searchParams = useSearchParams()

  const programId = searchParams.get("program") ?? undefined
  const schoolYearId = searchParams.get("schoolYear") ?? undefined
  const semesterId = searchParams.get("semester") ?? undefined

  return useQuery({
    queryKey: [
      "dashboard-courses-by-program",
      programId,
      schoolYearId,
      semesterId,
    ],
    queryFn: () => getCoursesOfProgram(programId, schoolYearId, semesterId),
    enabled: Boolean(programId),
  })
}
