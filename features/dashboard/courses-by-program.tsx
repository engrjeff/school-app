"use client"

import { useEffect, useState } from "react"
import { Gender } from "@prisma/client"
import { ChartNoAxesColumnIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useCoursesByProgram } from "@/hooks/dashboard/use-courses-by-program"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function CoursesByProgram() {
  const courses = useCoursesByProgram()

  const [courseId, setCourseId] = useState(() => courses.data?.at(0)?.id)

  useEffect(() => {
    if (!courses.data?.at(0)) return
    setCourseId(courses.data?.at(0)?.id)
  }, [courses.data])

  const coursesData = courses.data ?? []

  const currentCourse = coursesData.find((c) => c.id === courseId)

  if (courses.isLoading) return <Skeleton className="h-[323px] w-full" />

  const dataToDisplay = currentCourse?.gradeYearLevels?.map((g) => {
    const students = g.enrolledClasses?.map((c) => c.students).flat() ?? []

    const male = students.filter((s) => s.gender === Gender.MALE).length
    //   Math.ceil(50 * Math.random())
    const female = students.filter((s) => s.gender === Gender.FEMALE).length
    //   Math.ceil(50 * Math.random())

    return {
      gradeLevel: `${g.displayName.charAt(0)}${g.level}`,
      male,
      female,
    }
  })

  const noData = dataToDisplay?.every((d) => d.female === 0 && d.male === 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <CardTitle>Student Stats by Grade Level</CardTitle>
          <CardDescription className="hidden">All Time</CardDescription>
        </div>
        {courses.data?.length === 1 ? null : (
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="bg-secondary dark:bg-secondary/40 w-min">
              <SelectValue placeholder="Courses" />
            </SelectTrigger>
            <SelectContent className="w-trigger-width">
              {courses.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>

      {noData ? (
        <CardContent className="text-muted-foreground flex h-[266px] flex-col items-center justify-center">
          <ChartNoAxesColumnIcon className="size-4" />
          <p>No data to display.</p>
        </CardContent>
      ) : (
        <>
          <CardContent className="pb-0">
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={dataToDisplay}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="gradeLevel"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="male"
                  fill="var(--color-male)"
                  barSize={20}
                  radius={0}
                />
                <Bar
                  dataKey="female"
                  fill="var(--color-female)"
                  barSize={20}
                  radius={0}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Enrolled students by gender per grade level.
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
