"use client"

import Link from "next/link"
import { ROLE } from "@prisma/client"
import {
  CopyPlusIcon,
  MoreHorizontal,
  PencilIcon,
  PlusCircleIcon,
  SigmaIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

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

export function EnrollmentRowActions({
  enrollmentId,
  forDetail,
}: {
  enrollmentId: string
  forDetail?: boolean
}) {
  if (forDetail)
    return (
      <>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="iconXXs" variant="ghost" aria-label="Open menu">
              <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/enrollments/new?duplicateId=${enrollmentId}`}>
                <CopyPlusIcon />
                Duplicate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/enrollments/${enrollmentId}/enroll-students`}>
                <UserPlusIcon />
                Enroll Students
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hidden">
              <PlusCircleIcon /> Add Subject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )

  return (
    <>
      <div className="flex items-center justify-center">
        <Button variant="link" asChild>
          <Link href={`/enrollments/${enrollmentId}`}>View</Link>
        </Button>
        <RoleAccess role={ROLE.SCHOOLADMIN}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="iconXs" variant="ghost" aria-label="Open menu">
                <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/enrollments/${enrollmentId}`}>
                  <PencilIcon />
                  Update
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/enrollments/new?duplicateId=${enrollmentId}`}>
                  <CopyPlusIcon />
                  Duplicate
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/enrollments/${enrollmentId}/students`}>
                  <UsersIcon />
                  View Students
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/enrollments/${enrollmentId}/enroll-students`}>
                  <UserPlusIcon />
                  Enroll Students
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SigmaIcon />
                View Subjects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </RoleAccess>
      </div>
    </>
  )
}
