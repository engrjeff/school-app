"use client"

import { useSearchParams } from "next/navigation"

import { useCourses } from "@/hooks/use-courses"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function CourseFilter() {
  const courses = useCourses()

  const searchParams = useSearchParams()

  const programQuery = searchParams.get("program")

  const filteredCourses = programQuery
    ? courses.data?.filter((c) => c.programOfferingId === programQuery)
    : courses.data

  return (
    <TableFacetFilter
      filterKey="course"
      title="Course"
      selectedLabelKey="label"
      options={
        filteredCourses?.map((c) => ({
          label: c.code,
          value: c.id,
        })) ?? []
      }
    />
  )
}
