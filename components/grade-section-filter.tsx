"use client"

import { useSearchParams } from "next/navigation"

import { useGradeYearLevels } from "@/hooks/use-grade-levels"
import { Skeleton } from "@/components/ui/skeleton"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function GradeSectionFilter() {
  const searchParams = useSearchParams()

  const courseId = searchParams.get("course") ?? undefined

  const gradeLevels = useGradeYearLevels(courseId)

  if (gradeLevels.isLoading)
    return <Skeleton className="h-11 w-[115px] md:h-8" />

  const currentGradeLevel = gradeLevels.data?.find(
    (g) => g.id === searchParams.get("gradeYearLevel")
  )

  return (
    <>
      <TableFacetFilter
        filterKey="gradeYearLevel"
        title="Grade/Year Level"
        selectedLabelKey="label"
        singleSelection
        options={
          gradeLevels.data?.map((g) => ({
            label: `${g.displayName} ${g.level}`,
            value: g.id,
          })) ?? []
        }
      />
      {currentGradeLevel?.sections?.length ? (
        <TableFacetFilter
          filterKey="section"
          title="Section"
          selectedLabelKey="label"
          singleSelection
          options={
            currentGradeLevel?.sections?.map((section) => ({
              label: section.name,
              value: section.id,
            })) ?? []
          }
        />
      ) : null}
    </>
  )
}
