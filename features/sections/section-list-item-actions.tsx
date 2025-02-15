"use client"

import Link from "next/link"
import { Section } from "@prisma/client"
import { BookCheck, MoreHorizontal, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SectionListItemActions({ section }: { section: Section }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="iconXXs"
          variant="ghost"
          className="hover:border"
          aria-label={`View actions for ${section.name}`}
        >
          <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`#`}>
            <UserCheck />
            Enrolled Students
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`#`}>
            <BookCheck />
            Teachers
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
