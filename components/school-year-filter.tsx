"use client"

import { useSearchParams } from "next/navigation"

import { useSchoolYears } from "@/hooks/use-schoolyears"
import { Skeleton } from "@/components/ui/skeleton"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function SchoolYearFilter({
  initialProgramId,
}: {
  initialProgramId?: string
}) {
  const schoolYears = useSchoolYears(initialProgramId)
  const searchParams = useSearchParams()

  if (schoolYears.isLoading)
    return <Skeleton className="h-11 w-[115px] md:h-8" />

  const currentSchoolYear = schoolYears.data?.find(
    (sy) => sy.id === searchParams.get("schoolYear")
  )

  return (
    <>
      <TableFacetFilter
        filterKey="schoolYear"
        title="School Year"
        selectedLabelKey="label"
        singleSelection
        options={
          schoolYears.data?.map((sy) => ({
            label: `S.Y. ${sy.title}`,
            value: sy.id,
          })) ?? []
        }
      />
      <TableFacetFilter
        filterKey="semester"
        title="Semester"
        selectedLabelKey="label"
        singleSelection
        options={
          currentSchoolYear?.semesters?.map((sy) => ({
            label: `S.Y. ${sy.title}`,
            value: sy.id,
          })) ?? []
        }
      />
    </>
  )
}
