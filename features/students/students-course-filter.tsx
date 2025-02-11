"use client"

import { useCourses } from "@/hooks/use-courses"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function StudentsCourseFilter() {
  const courses = useCourses()

  return (
    <TableFacetFilter
      filterKey="course"
      title="Course"
      selectedLabelKey="label"
      options={
        courses.data?.map((c) => ({
          label: c.code,
          value: c.id,
        })) ?? []
      }
    />
  )
}
