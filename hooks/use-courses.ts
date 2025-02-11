"use client"

import { Course } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getCourses() {
  const response = await apiClient.get<Course[]>("/courses")
  return response.data
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  })
}
