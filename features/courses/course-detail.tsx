import { Course, GradeYearLevel, Subject } from "@prisma/client"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { CourseUpdateFormDialog } from "./course-update-form"

export function CourseDetail({
  course,
}: {
  course: Course & { subjects: Subject[]; gradeYearLevels: GradeYearLevel[] }
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        {/* basic details */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>{course.code}</CardTitle>
            <CardDescription>{course.title}</CardDescription>
            <div className="absolute right-2 top-1">
              <CourseUpdateFormDialog course={course} />
            </div>
          </CardHeader>
          <CardContent>
            {course.description && (
              <>
                <CardTitle className="mb-2">Description</CardTitle>
                <p className="text-sm">{course.description}</p>
              </>
            )}
          </CardContent>
        </Card>
        {/* grade/year levels */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Levels</CardTitle>
            <ul>
              {course.gradeYearLevels.map((g) => (
                <li key={g.id}>
                  <CardDescription>
                    {g.displayName} {g.level}
                  </CardDescription>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              size="iconXs"
              variant="secondary"
              aria-label="edit course levels"
              className="absolute right-2 top-1"
            >
              <Pencil />
            </Button>
          </CardHeader>
        </Card>
      </div>

      {/* subjects */}
      <Card className="relative">
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            Subjects that need to be taken for {course.code}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[460px]">
            <ul className="space-y-4">
              {course.subjects.map((subject) => (
                <li key={subject.id} className="bg-accent rounded p-4">
                  <p className="font-medium group-hover:underline">
                    {subject.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {subject.code === "--" || !subject.code
                      ? "No Description"
                      : subject.code}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
