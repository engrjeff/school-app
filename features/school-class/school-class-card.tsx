import {
  Class,
  GradeYearLevel,
  Section,
  Subject,
  Teacher,
} from "@prisma/client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  schoolClass: Class & {
    gradeYearLevel: GradeYearLevel
    section: Section
    subject: Subject
    teacher: Teacher
  }
}

export function SchoolClassCard({ schoolClass: c }: Props) {
  return (
    <Card
      className="bg-accent/40 hover:border-primary relative"
      title="View class record"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xs font-normal">
          <p className="text-muted-foreground uppercase">Grade & Section</p>
          <p className="font-semibold uppercase">
            {c.gradeYearLevel.displayName} {c.gradeYearLevel.level} -{" "}
            {c.section.name}
          </p>
        </CardTitle>
        <CardTitle className="flex items-center justify-between text-xs font-normal">
          <p className="text-muted-foreground uppercase">Subject</p>
          <p className="font-semibold uppercase">
            {!c.subject.code || c.subject.code === "--"
              ? c.subject.title
              : c.subject.code}
          </p>
        </CardTitle>
        <CardTitle className="flex items-center justify-between text-xs font-normal">
          <p className="text-muted-foreground uppercase">Teacher</p>
          <p className="font-semibold uppercase">
            {c.teacher.lastName}, {c.teacher.firstName} {c.teacher.middleName}{" "}
            {c.teacher.suffix}
          </p>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
