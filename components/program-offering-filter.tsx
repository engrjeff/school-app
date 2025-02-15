"use client"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function ProgramOfferingFilter() {
  const programs = useProgramOfferings()

  return (
    <TableFacetFilter
      filterKey="program"
      title="Program"
      selectedLabelKey="label"
      singleSelection
      options={
        programs.data?.map((c) => ({
          label: c.title,
          value: c.id,
        })) ?? []
      }
    />
  )
}
