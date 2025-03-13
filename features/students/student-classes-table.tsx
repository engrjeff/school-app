"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ClassSubject,
  Course,
  EnrollmentClass,
  GradeYearLevel,
  SchoolYear,
  Section,
  Semester,
  Subject,
  Teacher,
} from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUpIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DetailedEnrollementClass extends EnrollmentClass {
  subjects: Array<ClassSubject & { subject: Subject; teacher: Teacher }>
  schoolYear: SchoolYear
  semester: Semester
  gradeYearLevel: GradeYearLevel
  course: Course
  section: Section
}

const columns: ColumnDef<DetailedEnrollementClass>[] = [
  {
    header: "Semester",
    accessorKey: "semester.title",
    cell: ({ row }) => (
      <Link href={`#`} className="group">
        <p className="line-clamp-1 group-hover:underline">
          {row.original.semester.title}
        </p>
        <p className="text-muted-foreground text-xs">
          S.Y. {row.original.schoolYear.title}
        </p>
      </Link>
    ),
  },
  {
    header: "Course",
    cell: ({ row }) => <p>{row.original.course.code}</p>,
  },
  {
    header: "Grade & Section",
    cell: ({ row }) => (
      <p>
        {row.original.gradeYearLevel.displayName}{" "}
        {row.original.gradeYearLevel.level} - {row.original.section.name}
      </p>
    ),
  },

  {
    header: "",
    id: "action",
    size: 36,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="iconXs" variant="ghost" aria-label="Open class menu">
            <MoreHorizontalIcon size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/enrollments/${row.original.id}`} prefetch>
              View
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function StudentClassesTable({
  enrollmentClasses,
}: {
  enrollmentClasses: DetailedEnrollementClass[]
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: enrollmentClasses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
    getRowId: (row) => row.id,
  })

  return (
    <div className="space-y-4 overflow-hidden">
      <div className="w-full max-w-full overflow-auto">
        <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="first:rounded-none first:border-x-0 last:rounded-none last:border-x-0"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer select-none items-center justify-between gap-2 whitespace-nowrap"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No enrollments to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pageSize > enrollmentClasses.length ? null : (
        <div className="flex items-center justify-between gap-8">
          {/* Results per page */}
          <div className="flex items-center gap-3">
            <Label className="max-sm:sr-only">Rows per page</Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-fit whitespace-nowrap">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                {[10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Page number information */}
          <div className="text-muted-foreground flex grow justify-end whitespace-nowrap text-sm">
            <p
              className="text-muted-foreground whitespace-nowrap text-sm"
              aria-live="polite"
            >
              <span className="text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  Math.max(
                    table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                    0
                  ),
                  table.getRowCount()
                )}
              </span>{" "}
              of{" "}
              <span className="text-foreground">
                {table.getRowCount().toString()}
              </span>
            </p>
          </div>
          {/* Pagination buttons */}
          <div>
            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page"
                  >
                    <ChevronFirst
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </PaginationItem>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </PaginationItem>
                {/* Last page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page"
                  >
                    <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  )
}
