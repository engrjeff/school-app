"use client"

import { Faculty } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getFaculties(programId: string) {
  const response = await apiClient.get<Faculty[]>("/faculties", {
    params: { programId },
  })
  return response.data
}

export function useFaculties(programId?: string) {
  return useQuery({
    queryKey: ["faculties", programId],
    queryFn: () => getFaculties(programId!),
    enabled: Boolean(programId),
  })
}
