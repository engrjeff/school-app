"use client"

import { useSearchParams } from "next/navigation"
import { SchoolYear, Semester } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getSchoolYears(programId: string) {
  const response = await apiClient.get<
    Array<SchoolYear & { semesters: Semester[] }>
  >("/school-years", {
    params: { programId },
  })
  return response.data
}

export function useSchoolYears() {
  const searchParams = useSearchParams()

  const programId = searchParams.get("program")

  return useQuery({
    queryKey: ["school-years", programId],
    queryFn: () => getSchoolYears(programId!),
    enabled: Boolean(programId),
  })
}
