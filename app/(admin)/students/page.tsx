import { type Metadata } from "next"
import Link from "next/link"
import { StudentsTable } from "@/features/students/students-table"
import { BookIcon, Filter, ImportIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SearchField } from "@/components/search-field"

export const metatdata: Metadata = {
  title: "Students",
}

function StudentsPage() {
  return (
    <>
      <AppHeader pageTitle="Students" />
      <AppContent>
        <div className="flex items-center justify-between gap-4">
          <SearchField className="w-[300px]" />

          {/* Filter by grade/year level */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondaryOutline" size="sm">
                <Filter
                  className="-ms-1 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Grade Level
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox id={`${value}-${i}`} />
                      <Label
                        htmlFor={`${value}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Grade {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {10}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter by course */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondaryOutline" size="sm">
                <BookIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Course
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox id={`${value}-${i}`} />
                      <Label
                        htmlFor={`${value}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Course {value}{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {10}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="ml-auto space-x-3">
            <Button type="button" size="sm" variant="secondaryOutline">
              <ImportIcon /> Import
            </Button>
            <Button asChild size="sm">
              <Link href="#">
                <PlusIcon className="size-4" /> Add Student
              </Link>
            </Button>
          </div>
        </div>

        <StudentsTable />
      </AppContent>
    </>
  )
}

export default StudentsPage
