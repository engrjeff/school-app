"use client"

import { SubjectGradeComponent, SubjectGradeSubComponent } from "@prisma/client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { GradeComponentEditFormDialog } from "./grade-component-edit-form"

export function GradeComponentCard({
  gradeComponent: gc,
}: {
  gradeComponent: SubjectGradeComponent & {
    subcomponents: SubjectGradeSubComponent[]
  }
}) {
  return (
    <Card className="bg-accent/40 relative">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">
          {gc.title} - {gc.percentage * 100}%
        </CardTitle>
        <CardDescription>{gc.label}</CardDescription>
      </CardHeader>
      <GradeComponentEditFormDialog gradeComponent={gc} />
    </Card>
  )
}
