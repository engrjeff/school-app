import { Metadata } from "next"
import Link from "next/link"
import { EnrollmentRowActions } from "@/features/enrollments/enrollment-row-actions"
import {
  getEnrollments,
  GetEnrollmentsArgs,
} from "@/features/enrollments/queries"
import { InboxIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { CourseFilter } from "@/components/course-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SortLink } from "@/components/sort-link"

export const metadata: Metadata = {
  title: "Enrollments",
}

async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: GetEnrollmentsArgs
}) {
  const { enrollments, pageInfo } = await getEnrollments(searchParams)

  return (
    <>
      <AppHeader pageTitle="Enrollments" />
      <AppContent>
        <div className="flex items-center gap-4">
          <ProgramOfferingFilter />
          <CourseFilter />
          <div className="ml-auto">
            <Button asChild size="sm">
              <Link href="/enrollments/new">
                <PlusIcon className="size-4" /> Create Enrollment
              </Link>
            </Button>
          </div>
        </div>
        {enrollments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No enrollments found yet. Create one now.
            </p>
            <Button asChild size="sm">
              <Link href="/enrollments/new">
                <PlusIcon className="size-4" /> Create Enrollment
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-full flex-1 overflow-auto">
            <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-1">
                    <SortLink title="Program" sortValue="program" />
                  </TableHead>
                  <TableHead className="px-1">
                    <SortLink title="School Year" sortValue="schoolYear" />
                  </TableHead>
                  <TableHead className="px-1">
                    <SortLink title="Semester" sortValue="semester" />
                  </TableHead>
                  <TableHead className="px-1">
                    <SortLink title="Course" sortValue="course" />
                  </TableHead>
                  <TableHead className="px-1">
                    <SortLink
                      title="Grade & Section"
                      sortValue="gradeYearLevel"
                    />
                  </TableHead>
                  <TableHead className="px-1">
                    <SortLink title="# Students" sortValue="student_count" />
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.programOffering.code}</TableCell>
                    <TableCell>S.Y. {e.schoolYear.title}</TableCell>
                    <TableCell>{e.semester.title}</TableCell>
                    <TableCell>
                      <Link
                        href={`/courses/${e.courseId}`}
                        className="hover:underline"
                      >
                        <p className="line-clamp-1">
                          {!e.course.code || e.course.code === "--"
                            ? e.course.title
                            : e.course.code}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {e.gradeYearLevel.displayName} {e.gradeYearLevel.level}-
                      {e.section.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={e._count.students === 0 ? "warn" : "success"}
                      >
                        {e._count.students === 0
                          ? "No students yet"
                          : `${e._count.students} students`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EnrollmentRowActions enrollmentId={e.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default EnrollmentsPage
