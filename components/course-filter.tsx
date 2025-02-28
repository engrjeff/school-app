"use client"

import { useSearchParams } from "next/navigation"

import { useCourses } from "@/hooks/use-courses"
import { Skeleton } from "@/components/ui/skeleton"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function CourseFilter() {
  const courses = useCourses()

  const searchParams = useSearchParams()

  if (courses.isLoading) return <Skeleton className="h-11 w-[115px] md:h-8" />

  const programQuery = searchParams.get("program")

  const filteredCourses = programQuery
    ? courses.data?.filter((c) => c.programOfferingId === programQuery)
    : courses.data

  return (
    <TableFacetFilter
      filterKey="course"
      title="Course"
      selectedLabelKey="label"
      singleSelection
      options={
        filteredCourses?.map((c) => ({
          label: c.code,
          value: c.id,
        })) ?? []
      }
    />
  )
}
