"use client"

import { parseAsString, useQueryStates } from "nuqs"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { Skeleton } from "@/components/ui/skeleton"
import { TableFacetFilter } from "@/components/table-facet-filter"

export function ProgramOfferingFilter() {
  const programs = useProgramOfferings()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOthers] = useQueryStates({
    course: parseAsString,
    faculty: parseAsString,
  })

  if (programs.isLoading) return <Skeleton className="h-11 w-[115px] md:h-8" />

  return (
    <TableFacetFilter
      filterKey="program"
      title="Program"
      selectedLabelKey="label"
      singleSelection
      onChangeCallback={() => setOthers(null)}
      shouldSetToFirstOption
      options={
        programs.data?.map((c) => ({
          label: c.title,
          value: c.id,
        })) ?? []
      }
    />
  )
}
