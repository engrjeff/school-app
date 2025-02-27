"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"

import { useSchoolYears } from "@/hooks/use-schoolyears"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function SchoolYearsSelector() {
  const schoolYears = useSchoolYears()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const router = useRouter()

  if (schoolYears.isLoading) return <Skeleton className="h-9 w-36 px-4 py-2" />

  const activeSchoolYear = schoolYears.data?.find(
    (sy) => sy.id === params.id
  )?.id

  return (
    <Select
      value={activeSchoolYear}
      onValueChange={(value) => {
        router.push(
          `/school-years/${value}?program=${searchParams.get("program")}`
        )
      }}
    >
      <SelectTrigger className="gap-4 border-none font-semibold">
        <SelectValue placeholder="School Years" />
      </SelectTrigger>
      <SelectContent className="w-trigger-width">
        {schoolYears.data?.map((sy) => (
          <SelectItem key={sy.id} value={sy.id}>
            S.Y. {sy.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
