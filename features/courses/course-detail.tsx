import { Course, GradeYearLevel, Subject } from "@prisma/client"
import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { SubjectEditFormDialog } from "../subjects/subject-edit-form"
import { SubjectFormDialog } from "../subjects/subject-form"
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
              size="iconXXs"
              variant="ghost"
              aria-label={`edit course levels`}
              className="absolute right-2 top-1 hover:border"
            >
              <PencilIcon />
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
          <div className="absolute right-4 top-4">
            <SubjectFormDialog courseName={course.code} courseId={course.id} />
          </div>
        </CardHeader>
        <CardContent>
          {course.subjects.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed">
              <p className="text-center text-base">No subjects yet.</p>
              <p className="text-muted-foreground mb-4 text-center">
                Add a subject now.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[460px]">
              <ul className="space-y-4">
                {course.subjects.map((subject) => (
                  <li key={subject.id}>
                    <SubjectItem subject={subject} />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SubjectItem({ subject }: { subject: Subject }) {
  return (
    <Card className="bg-accent/40 group-hover:border-primary relative rounded-md">
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{subject.title}</CardTitle>
        <CardDescription>Code: {subject.code}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-xs">
          {subject.code === "--" || !subject.code
            ? "No Description"
            : subject.code}
        </p>
      </CardContent>
      <SubjectEditFormDialog subject={subject} />
    </Card>
  )
}
