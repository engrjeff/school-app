"use client"

import { Grid2x2Icon, ListIcon } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"

export function ViewToggle() {
  const [viewParam, setViewParam] = useQueryState(
    "view",
    parseAsString.withOptions({ shallow: false })
  )

  return (
    <div className="shadow-xs inline-flex -space-x-px rounded-md rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant={viewParam !== "list" ? "outline" : "secondaryOutline"}
        size="icon"
        aria-label="Grid view"
        onClick={() => setViewParam(null)}
      >
        <Grid2x2Icon size={16} aria-hidden="true" />
      </Button>
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant={viewParam === "list" ? "outline" : "secondaryOutline"}
        size="icon"
        aria-label="List View"
        onClick={() => setViewParam("list")}
      >
        <ListIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  )
}
