"use client"

import { Grid2x2Check, ImportIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ImportButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="secondaryOutline">
          <ImportIcon /> Import
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Grid2x2Check
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          Download Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
