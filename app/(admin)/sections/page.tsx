import { type Metadata } from "next"
import Link from "next/link"
import { getSections, GetSectionsArgs } from "@/features/sections/queries"
import { SectionList } from "@/features/sections/section-list"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
      <AppHeader pageTitle="Sections" />
      <AppContent>
        <ScrollArea className="w-full whitespace-nowrap border-b pb-3">
          <div className="flex gap-4">
            {data?.map((program) => (
              <Link
                key={program.id}
                href={`/sections?program=${program.id}`}
                className="group shrink-0 basis-56"
              >
                <Card
                  className={cn(
                    "bg-accent/40 group-hover:border-primary rounded-md",
                    activeProgram?.id === program.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : ""
                  )}
                >
                  <CardHeader className="p-3">
                    <CardTitle>{program.code}</CardTitle>
                    <CardDescription
                      className={cn(
                        "line-clamp-1",
                        activeProgram?.id === program.id
                          ? "text-primary-foreground"
                          : ""
                      )}
                    >
                      {program.title}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="grid grid-cols-[300px_auto] gap-6">
          <ScrollArea className="h-[70dvh] border-r pr-3">
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
                      <Card
                        className={cn(
                          "bg-accent/40 group-hover:border-primary rounded-md",
                          activeCourse?.id === course.id
                            ? "bg-primary text-primary-foreground border-primary"
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
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3 rounded-md border p-6 text-center">
                <p>No courses listed yet.</p>
                <Button size="sm" asChild>
                  <Link
                    href={`/program-offerings/${activeProgram?.id}/courses/new`}
                  >
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
