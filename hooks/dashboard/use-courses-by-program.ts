"use client"

import { useSearchParams } from "next/navigation"
import {
  Course,
  EnrollmentClass,
  GradeYearLevel,
  Student,
} from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

interface DetailedCourse extends Course {
  gradeYearLevels: Array<
    GradeYearLevel & {
      enrolledClasses: Array<EnrollmentClass & { students: Student[] }>
    }
  >
}

async function getCoursesOfProgram(programId?: string, schoolYearId?: string) {
  const response = await apiClient.get<DetailedCourse[]>(
    "/dashboard/courses-by-program",
    {
      params: { programId, schoolYearId },
    }
  )
  return response.data
}

export function useCoursesByProgram() {
  const searchParams = useSearchParams()

  const programId = searchParams.get("program") ?? undefined
  const schoolYearId = searchParams.get("schoolYear") ?? undefined

  return useQuery({
    queryKey: ["dashboard-courses-by-program", programId, schoolYearId],
    queryFn: () => getCoursesOfProgram(programId, schoolYearId),
    enabled: Boolean(programId),
  })
}
