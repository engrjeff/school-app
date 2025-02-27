"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { useProgramOfferings } from "@/hooks/use-program-offerings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function ProgramOfferingSelector() {
  const programs = useProgramOfferings()
  const params = useSearchParams()

  const router = useRouter()

  if (programs.isLoading) return <Skeleton className="h-9 w-36 px-4 py-2" />

  return (
    <Select
      defaultValue={params.get("program") ?? ""}
      onValueChange={(value) => router.push(`/school-years?program=${value}`)}
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
