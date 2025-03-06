"use client"

import Link from "next/link"
import { ROLE } from "@prisma/client"
import { CopyIcon, MoreHorizontalIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleAccess } from "@/components/role-access"

export function ClassActions({ classId }: { classId: string }) {
  return (
    <RoleAccess role={ROLE.SCHOOLADMIN}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="iconXXs"
            variant="ghost"
            aria-label="Open edit menu"
            className="text-muted-foreground hover:text-foreground absolute right-0.5 top-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild disabled>
            <Link href={"#"}>
              <PencilIcon className="size-3" /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/classes/${classId}/duplicate`}>
              <CopyIcon className="size-4" /> Duplicate
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </RoleAccess>
  )
}
