"use client"

import Link from "next/link"
import { SignOutDialog } from "@/features/auth/SignOutDialog"
import { ROLE } from "@prisma/client"
import { BadgeCheckIcon, ChevronsUpDown, LibraryIcon } from "lucide-react"
import { useSession } from "next-auth/react"

import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Skeleton } from "./ui/skeleton"

export function NavUser() {
  const { isMobile } = useSidebar()

  const session = useSession()

  if (session.status === "loading") {
    return <Skeleton className="h-12 w-full" />
  }

  const user = session.data?.user

  if (!user || session.status === "unauthenticated") return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                {user?.image ? (
                  <AvatarImage src={user?.image} alt={user.name!} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                  {getInitials(user.name!)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  {user.image ? (
                    <AvatarImage src={user?.image} alt={user.name!} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-lg">
                    {getInitials(user.name!)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {user.role === ROLE.TEACHER ? (
                <DropdownMenuItem asChild>
                  <Link href="/classes">
                    <LibraryIcon />
                    Classes
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutDialog />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
