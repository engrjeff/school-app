import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseBasicTable } from "@/features/courses/course-basic-table"
import { getSchoolOfUser } from "@/features/school/queries"
import { CirclePlus, Filter } from "lucide-react"

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

export const metadata: Metadata = {
  title: "Courses",
}

async function CoursesPage() {
  const { school } = await getSchoolOfUser()

  if (!school) return notFound()

  return (
    <>
      <AppHeader pageTitle="Courses" />
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
                Program
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {school.programOfferings.map((program) => (
                    <div key={program.id} className="flex items-center gap-2">
                      <Checkbox id={program.id} />
                      <Label
                        htmlFor={program.id}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        {program.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto space-x-3">
            <Button size="sm">
              <CirclePlus /> Add Course
            </Button>
          </div>
        </div>

        <CourseBasicTable courses={school.courses} />
      </AppContent>
    </>
  )
}

export default CoursesPage
