"use client"

import { parseAsString, useQueryState } from "nuqs"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Skeleton } from "./ui/skeleton"

export function ProgramOfferingTabs() {
  const programs = useProgramOfferings()

  const [programQuery, setProgramQuery] = useQueryState(
    "program",
    parseAsString.withOptions({ shallow: false })
  )

  if (programs.isLoading) return <Skeleton className="h-9 w-[230px]" />

  if (programs.data?.length === 1) return null

  return (
    <Tabs value={programQuery ?? ""} onValueChange={setProgramQuery}>
      <TabsList>
        {programs.data?.map((program) => (
          <TabsTrigger key={program.id} value={program.id}>
            {program.code}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
