"use client"

import { useSearchParams } from "next/navigation"

import { useFaculties } from "@/hooks/use-faculties"
import { Skeleton } from "@/components/ui/skeleton"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function FacultyFilter() {
  const searchParams = useSearchParams()

  const programQuery = searchParams.get("program")

  const faculties = useFaculties(programQuery ?? undefined)

  if (faculties.isLoading) return <Skeleton className="h-11 w-[115px] md:h-8" />

  const filteredFaculties = programQuery
    ? faculties.data?.filter((f) => f.programOfferingId === programQuery)
    : faculties.data

  return (
    <TableFacetFilter
      filterKey="faculty"
      title="Faculty"
      selectedLabelKey="label"
      singleSelection
      options={
        filteredFaculties?.map((f) => ({
          label: f.title,
          value: f.id,
        })) ?? []
      }
    />
  )
}
