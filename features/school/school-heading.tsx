"use client"

import Link from "next/link"
import { School } from "@prisma/client"
import {
  ChevronsUpDown,
  CirclePlusIcon,
  ExternalLink,
  SchoolIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function SchoolHeading({ school }: { school: School }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <SchoolIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{school.name}</span>
                <span className="truncate text-xs">{school.address}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/enrollments/new">
                <CirclePlusIcon className="size-4 shrink-0" />
                Create Enrollment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href={`#`}>
                <ExternalLink className="size-4 shrink-0" />
                View in School Directory
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
