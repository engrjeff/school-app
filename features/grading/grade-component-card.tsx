"use client"

import { GradeComponent, GradeComponentPart } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { GradeComponentEditFormDialog } from "./grade-component-edit-form"

export function GradeComponentCard({
  gradeComponent: gc,
}: {
  gradeComponent: GradeComponent & { parts: GradeComponentPart[] }
}) {
  return (
    <Card className="bg-accent/40 relative">
      <CardHeader>
        <CardTitle className="text-sm">
          {gc.title} - {gc.percentage * 100}%
        </CardTitle>
        <CardDescription>{gc.label}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm">View Subcomponents ({gc.parts.length})</Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-auto rounded-lg border p-0 focus-visible:outline-none sm:max-w-lg"
          >
            <SheetHeader className="space-y-1 border-b p-4 text-left">
              <SheetTitle>
                {gc.title} - {gc.percentage * 100}%
              </SheetTitle>
              <SheetDescription>{gc.label}</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <p className="text-sm font-semibold">Subcomponents</p>
              <ul className="space-y-2">
                {gc.parts.map((p) => (
                  <li key={p.id}>
                    <Card className="bg-accent/40 text-sm">
                      <CardHeader className="p-3">
                        <CardTitle>{p.title}</CardTitle>
                        <CardDescription>
                          Highest Possible Score: {p.highestPossibleScore}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
      <GradeComponentEditFormDialog gradeComponent={gc} />
    </Card>
  )
}
