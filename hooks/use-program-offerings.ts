"use client"

import { ProgramOffering } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getProgramOfferings() {
  const response = await apiClient.get<ProgramOffering[]>("/program-offerings")
  return response.data
}

export function useProgramOfferings() {
  return useQuery({
    queryKey: ["program-offerings"],
    queryFn: getProgramOfferings,
  })
}
