"use client"

import NumberFlow from "@number-flow/react"
import {
  LibraryIcon,
  SquareStackIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"

import { useSimpleNumbers } from "@/hooks/dashboard/use-simple-numbers"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SchoolSimpleNumbers() {
  const simpleNumbersQuery = useSimpleNumbers()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Enrolled Students
          </CardDescription>
          <div
            className="bg-primary h-0.5 w-5 rounded-full"
            aria-hidden={true}
          ></div>
          <CardTitle>
            <span className="text-2xl">
              <NumberFlow value={simpleNumbersQuery.data?.students ?? 0} />
            </span>
            {"  "}
            <span className="text-muted-foreground text-xs font-normal tracking-wide">
              out of {simpleNumbersQuery.data?.allStudents} registered students
            </span>
          </CardTitle>
          <span className="absolute right-4 top-3">
            <UsersIcon className="text-muted-foreground size-5" />
          </span>
        </CardHeader>
      </Card>
      <Card className="relative">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Enrollments
          </CardDescription>
          <div
            className="h-0.5 w-5 rounded-full bg-emerald-500"
            aria-hidden={true}
          ></div>
          <CardTitle>
            <span className="text-2xl">
              <NumberFlow
                value={simpleNumbersQuery.data?.enrolledClasses ?? 0}
              />
            </span>
            {"  "}
            <span className="text-muted-foreground text-xs font-normal tracking-wide">
              {simpleNumbersQuery.data?.schoolYear}
            </span>
          </CardTitle>
          <span className="absolute right-4 top-3">
            <LibraryIcon className="text-muted-foreground size-5" />
          </span>
        </CardHeader>
      </Card>
      <Card className="relative">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Teachers
          </CardDescription>
          <div
            className="h-0.5 w-5 rounded-full bg-orange-500"
            aria-hidden={true}
          ></div>
          <CardTitle>
            <span className="text-2xl">
              <NumberFlow value={simpleNumbersQuery.data?.teachers ?? 0} />
            </span>
            {"  "}
            <span className="text-muted-foreground text-xs font-normal tracking-wide">
              from {simpleNumbersQuery.data?.faculties} faculties
            </span>
          </CardTitle>
          <span className="absolute right-4 top-3">
            <UserCogIcon className="text-muted-foreground size-5" />
          </span>
        </CardHeader>
      </Card>

      <Card className="relative">
        <CardHeader>
          <CardDescription className="text-xs uppercase tracking-wide">
            Courses/Tracks
          </CardDescription>
          <div
            className="h-0.5 w-5 rounded-full bg-rose-500"
            aria-hidden={true}
          ></div>
          <CardTitle>
            <span className="text-2xl">
              <NumberFlow value={simpleNumbersQuery.data?.courses ?? 0} />
            </span>
            {"  "}
            <span className="text-muted-foreground text-xs font-normal tracking-wide">
              from {simpleNumbersQuery.data?.programOfferings} programs
            </span>
          </CardTitle>
          <span className="absolute right-4 top-3">
            <SquareStackIcon className="text-muted-foreground size-5" />
          </span>
        </CardHeader>
      </Card>
    </div>
  )
}
