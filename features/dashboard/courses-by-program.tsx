"use client"

import { useEffect, useState } from "react"
import { Gender } from "@prisma/client"
import { ChartNoAxesColumnIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useCoursesByProgram } from "@/hooks/dashboard/use-courses-by-program"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

export function EnrolledStudentsByGender() {
  const courses = useCoursesByProgram()

  const [courseId, setCourseId] = useState(() => courses.data?.at(0)?.id)

  useEffect(() => {
    if (!courses.data?.at(0)) return
    setCourseId(courses.data?.at(0)?.id)
  }, [courses.data])

  const coursesData = courses.data ?? []

  const currentCourse = coursesData.find((c) => c.id === courseId)

  if (courses.isLoading) return <Skeleton className="h-[340px] w-full" />

  const dataToDisplay = currentCourse?.gradeYearLevels?.map((g) => {
    const students =
      currentCourse.students.filter(
        (s) => s.currentGradeYearLevel.id === g.id
      ) ?? []

    const male = students.filter((s) => s.gender === Gender.MALE).length
    const female = students.filter((s) => s.gender === Gender.FEMALE).length

    return {
      gradeLevel: `${g.displayName.charAt(0)}${g.level}`,
      male,
      female,
    }
  })

  const noData = dataToDisplay?.every((d) => d.female === 0 && d.male === 0)

  const barSize = 30

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b">
        <div className="flex-1">
          <CardTitle>Student Stats by Grade Level</CardTitle>
          <CardDescription>Enrolled students by gender</CardDescription>
        </div>
        {courses.data?.length === 1 ? null : (
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="bg-secondary dark:bg-secondary/40 h-7 w-min -translate-y-2 translate-x-2 text-xs">
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
        <CardContent className="text-muted-foreground flex h-[266px] flex-col items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartNoAxesColumnIcon className="size-4" />
          <p>No data to display.</p>
        </CardContent>
      ) : (
        <>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[220px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={dataToDisplay}
                margin={{ left: -30 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="gradeLevel"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={3}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="male"
                  fill="var(--color-male)"
                  barSize={barSize}
                  radius={0}
                />
                <Bar
                  dataKey="female"
                  fill="var(--color-female)"
                  barSize={barSize}
                  radius={0}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  )
}

export function EnrolledStudentsByCourse() {
  const coursesQuery = useCoursesByProgram()

  const [gradeLevel, setGradeLevel] = useState<string>("All levels")

  if (coursesQuery.isLoading) return <Skeleton className="h-[340px] w-full" />

  const dataToDisplay = coursesQuery.data?.map((course) => {
    const male =
      gradeLevel === "All levels"
        ? course.students.filter((s) => s.gender === Gender.MALE).length
        : course.students.filter(
            (s) =>
              s.gender === Gender.MALE &&
              `${s.currentGradeYearLevel.displayName} ${s.currentGradeYearLevel.level}` ===
                gradeLevel
          ).length

    const female =
      gradeLevel === "All levels"
        ? course.students.filter((s) => s.gender === Gender.FEMALE).length
        : course.students.filter(
            (s) =>
              s.gender === Gender.FEMALE &&
              `${s.currentGradeYearLevel.displayName} ${s.currentGradeYearLevel.level}` ===
                gradeLevel
          ).length

    return {
      course: course.code,
      male,
      female,
    }
  })

  const noData = dataToDisplay?.every((d) => d.female === 0 && d.male === 0)

  const barSize = 30

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex-1">
          <CardTitle>Student Stats by Course/Track</CardTitle>
          <CardDescription>Enrolled students by course/track</CardDescription>
        </div>
        <Select value={gradeLevel} onValueChange={setGradeLevel}>
          <SelectTrigger className="bg-secondary dark:bg-secondary/40 h-7 w-min -translate-y-2 translate-x-2 text-xs">
            <SelectValue placeholder="Grade Level" />
          </SelectTrigger>
          <SelectContent className="w-trigger-width">
            <SelectItem value="All levels">All levels</SelectItem>
            {coursesQuery.data?.at(0)?.gradeYearLevels?.map((g) => (
              <SelectItem key={g.id} value={`${g.displayName} ${g.level}`}>
                {g.displayName} {g.level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      {noData ? (
        <CardContent className="text-muted-foreground flex flex-1 flex-col items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartNoAxesColumnIcon className="size-4" />
          <p>No data to display.</p>
        </CardContent>
      ) : (
        <>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[220px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={dataToDisplay}
                margin={{ left: -30 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="course"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={3}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="male"
                  fill="var(--color-male)"
                  barSize={barSize}
                  radius={0}
                />
                <Bar
                  dataKey="female"
                  fill="var(--color-female)"
                  barSize={barSize}
                  radius={0}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  )
}
