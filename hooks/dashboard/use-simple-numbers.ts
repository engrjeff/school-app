"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

interface SimpleNumbers {
  students: number
  enrolledClasses: number
  programOfferings: number
  courses: number
  teachers: number
  faculties: number
  allStudents: number
  schoolYear: string
}

async function getSimpleNumbers(schoolYearId?: string, semesterId?: string) {
  const response = await apiClient.get<SimpleNumbers>(
    "/dashboard/simple-numbers",
    {
      params: { schoolYearId, semesterId },
    }
  )
  return response.data
}

export function useSimpleNumbers() {
  const searchParams = useSearchParams()

  const schoolYearId = searchParams.get("schoolYear") ?? undefined
  const semesterId = searchParams.get("semester") ?? undefined

  return useQuery({
    queryKey: ["dashboard-simple-numbers", schoolYearId, semesterId],
    queryFn: () => getSimpleNumbers(schoolYearId, semesterId),
  })
}
