import { type Metadata } from "next"
import Link from "next/link"
import { ProgramOfferingSelector } from "@/features/programs/progam-offering-selector"
import { getSections, GetSectionsArgs } from "@/features/sections/queries"
import { SectionList } from "@/features/sections/section-list"
import { PlusIcon, SlashIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Sections",
}

async function SectionsPage({
  searchParams,
}: {
  searchParams: GetSectionsArgs
}) {
  const { data } = await getSections(searchParams)

  const activeProgram = searchParams.program
    ? data?.find((p) => p.id === searchParams.program)
    : data?.at(0)

  const activeCourse = searchParams.course
    ? activeProgram?.courses?.find((c) => c.id === searchParams.course)
    : activeProgram?.courses?.at(0)

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-foreground font-semibold">
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <ProgramOfferingSelector hasInitial />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <div className="grid grid-cols-[300px_auto] gap-3">
          <ScrollArea className="h-[75dvh] border-r pr-3">
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase">
              Courses under {activeProgram?.code}
            </p>
            {activeProgram?.courses.length ? (
              <ul className="space-y-3">
                {activeProgram?.courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={{
                        pathname: "/sections",
                        query: {
                          program: course.programOfferingId,
                          course: course.id,
                        },
                      }}
                    >
                      <div
                        className={cn(
                          "bg-accent/40 group-hover:border-primary hover:bg-secondary rounded-md border",
                          activeCourse?.id === course.id
                            ? "text-primary-foreground border-l-primary border-l-2"
                            : ""
                        )}
                      >
                        <CardHeader className="p-2">
                          <CardTitle className="text-sm">
                            {course.code}
                          </CardTitle>
                          <CardDescription
                            className={cn(
                              "line-clamp-1 text-xs",
                              activeCourse?.id === course.id
                                ? "text-primary-foreground"
                                : ""
                            )}
                          >
                            {course.title}
                          </CardDescription>
                        </CardHeader>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3 rounded-md border p-6 text-center">
                <p>No courses listed yet.</p>
                <Button size="sm" asChild>
                  <Link href={`/courses/new?program=${activeProgram?.id}`}>
                    <PlusIcon />
                    Add Course
                  </Link>
                </Button>
              </div>
            )}
          </ScrollArea>
          {activeCourse ? (
            <Tabs
              key={activeCourse.id}
              defaultValue={activeCourse?.gradeYearLevels.at(0)?.id}
            >
              <TabsList>
                {activeCourse?.gradeYearLevels.map((g) => (
                  <TabsTrigger key={g.id} value={g.id}>
                    {g.displayName} {g.level}
                  </TabsTrigger>
                ))}
              </TabsList>
              {activeCourse?.gradeYearLevels.map((g) => (
                <TabsContent key={g.id} value={g.id} className="py-3">
                  <SectionList
                    key={g.id}
                    gradeYearLevelId={g.id}
                    currentSections={g.sections}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : null}
        </div>
      </AppContent>
    </>
  )
}

export default SectionsPage
