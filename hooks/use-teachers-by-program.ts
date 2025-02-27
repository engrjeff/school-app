"use client"

import { Teacher } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getTeachersByProgram(programId?: string) {
  const response = await apiClient.get<Teacher[]>("/teachers", {
    params: { programId },
  })
  return response.data
}

export function useTeachersByProgram(programId?: string) {
  return useQuery({
    queryKey: ["teachers", programId],
    queryFn: () => getTeachersByProgram(programId),
  })
}
