"use client"

import { useSearchParams } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"

import { useCourses } from "@/hooks/use-courses"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function CourseSelector() {
  const searchParams = useSearchParams()
  const courses = useCourses(searchParams.get("program") ?? undefined)

  const [courseParam, setCourseParam] = useQueryState(
    "course",
    parseAsString.withOptions({ shallow: false })
  )

  if (courses.isLoading) return <Skeleton className="h-9 w-36 px-4 py-2" />

  return (
    <Select
      defaultValue={courseParam ?? ""}
      onValueChange={(value) => setCourseParam(value)}
    >
      <SelectTrigger className="gap-4 border-none font-semibold">
        <SelectValue placeholder="Courses" />
      </SelectTrigger>
      <SelectContent className="w-trigger-width">
        {courses.data?.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
