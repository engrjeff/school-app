"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"

import { useSemesters } from "@/hooks/use-semesters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function SemesterSelector({ schoolYearId }: { schoolYearId: string }) {
  const semesters = useSemesters(schoolYearId)
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()

  const router = useRouter()

  if (semesters.isLoading) return <Skeleton className="h-9 w-36 px-4 py-2" />

  return (
    <Select
      defaultValue={searchParams.get("semester") ?? undefined}
      onValueChange={(value) =>
        router.push(`/school-years/${params.id}/semesters/${value}`)
      }
    >
      <SelectTrigger className="gap-4 border-none font-semibold">
        <SelectValue placeholder="Semesters" />
      </SelectTrigger>
      <SelectContent className="w-trigger-width">
        {semesters.data?.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
