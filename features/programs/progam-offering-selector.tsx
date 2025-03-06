"use client"

import { useEffect } from "react"
import { parseAsString, useQueryState, useQueryStates } from "nuqs"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function ProgramOfferingSelector({
  hasInitial,
}: {
  hasInitial?: boolean
}) {
  const programs = useProgramOfferings()

  const [programParam, setProgramParam] = useQueryState(
    "program",
    parseAsString.withOptions({ shallow: false })
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOthers] = useQueryStates({
    schoolYear: parseAsString,
    semester: parseAsString,
  })

  useEffect(() => {
    if (programParam) return

    if (!hasInitial) return

    if (!programs.data?.length) return

    setProgramParam(programs.data[0]?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitial, programParam, programs.data])

  if (programs.isLoading) return <Skeleton className="h-9 w-36 px-4 py-2" />

  return (
    <Select
      defaultValue={programParam ?? ""}
      onValueChange={(value) => {
        setProgramParam(value)
        setOthers(null)
      }}
    >
      <SelectTrigger className="gap-4 border-none font-semibold">
        <SelectValue placeholder="Programs" />
      </SelectTrigger>
      <SelectContent className="w-trigger-width">
        {programs.data?.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
