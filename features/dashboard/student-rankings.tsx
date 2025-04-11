"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Document, PDFViewer } from "@react-pdf/renderer/lib/react-pdf.browser"
import { BarChart2Icon, ChartBarIcon, Loader2Icon, XIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  RankingsQueryResponse,
  useRankings,
} from "@/hooks/dashboard/use-rankings"
import { useCertificateTemplates } from "@/hooks/use-certificate-templates"
import { useCourses } from "@/hooks/use-courses"
import { useSchoolYears } from "@/hooks/use-schoolyears"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CertificateTemplatePage } from "../certificates/certificate-form"
import { CertificateInputs } from "../certificates/schema"
import { getRemark } from "../grading/ranking"

export function StudentRankings() {
  const searchParams = useSearchParams()

  const program = searchParams.get("program") ?? undefined

  // states
  const [currentCourse, setCurrentCourse] = useState<string>()
  const [currentGradeLevel, setCurrentGradeLevel] = useState<string>()

  // options
  const coursesQuery = useCourses(program)

  const selectedCourse = coursesQuery.data?.find((c) => c.id === currentCourse)

  const gradeLevels = selectedCourse?.gradeYearLevels

  const selectedGradeLevel = gradeLevels?.find(
    (g) => g.id === currentGradeLevel
  )

  // data
  const rankingsQuery = useRankings({
    courseId: currentCourse,
    gradeLevelId: currentGradeLevel,
  })

  useEffect(() => {
    if (coursesQuery.data?.length) {
      const firstCourse = coursesQuery.data.at(0)

      setCurrentCourse(firstCourse?.id)

      setCurrentGradeLevel(firstCourse?.gradeYearLevels?.at(0)?.id)
    }
  }, [coursesQuery.data])

  if (rankingsQuery.isLoading)
    return (
      <div className="flex h-[360px] w-full flex-col items-center justify-center">
        <Loader2Icon className="size-5 animate-spin" />
        <p className="text-sm">Loading grades...</p>
      </div>
    )

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-3 border-b">
        <div className="flex-1">
          <CardTitle>Students Ranking</CardTitle>
          <CardDescription>
            Showing list of top-performing students.
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {coursesQuery.data ? (
            <Select
              value={currentCourse}
              onValueChange={(val) => {
                setCurrentCourse(val)

                const currentCourse = coursesQuery.data.find(
                  (d) => d.id === val
                )

                setCurrentGradeLevel(currentCourse?.gradeYearLevels?.at(0)?.id)
              }}
            >
              <SelectTrigger className="bg-secondary dark:bg-secondary/40 h-7 w-min -translate-y-2 translate-x-2 text-xs">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent className="w-trigger-width" align="end">
                {coursesQuery.data?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {gradeLevels ? (
            <Select
              key={currentCourse}
              value={currentGradeLevel}
              onValueChange={setCurrentGradeLevel}
            >
              <SelectTrigger className="bg-secondary dark:bg-secondary/40 h-7 w-min -translate-y-2 translate-x-2 text-xs">
                <SelectValue placeholder="Grade Level" />
              </SelectTrigger>
              <SelectContent className="w-trigger-width" align="end">
                {gradeLevels?.map((gl) => (
                  <SelectItem key={gl.id} value={gl.id}>
                    {gl.displayName} {gl.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="per-grade-level">
          <TabsList className="text-foreground h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1">
            <TabsTrigger
              value="per-grade-level"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Per Grade Level
            </TabsTrigger>
            <TabsTrigger
              value="per-section"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Per Section
            </TabsTrigger>
          </TabsList>
          <TabsContent value="per-grade-level">
            <RankingByGradeLevelContent
              rankingsPerGradeLevel={
                rankingsQuery.data?.rankingsPerGradeLevel ?? []
              }
            />
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Top Students under {selectedGradeLevel?.displayName}{" "}
              {selectedGradeLevel?.level} - {selectedCourse?.code}
            </p>
          </TabsContent>
          <TabsContent value="per-section">
            {rankingsQuery.data?.rankingsPerSection.map((section) => (
              <div key={section.section} className="space-y-4 py-4">
                <p className="text-sm font-semibold">
                  Top Students under Section: {section.section}
                </p>
                <div className="space-y-4">
                  {section.subjectsWithGrades.map((subject) => (
                    <div className="space-y-4">
                      <p className="text-primary text-sm font-semibold">
                        Subject: {subject.subject}
                      </p>
                      <RankingBySectionContent
                        studentsWithGrades={subject.studentsWithGrades}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

const chartConfig = {
  grade: {
    label: "Grade",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

function RankingByGradeLevelContent({
  rankingsPerGradeLevel,
}: {
  rankingsPerGradeLevel: RankingsQueryResponse["rankingsPerGradeLevel"]
}) {
  const [selectedRowId, setSelectedRowId] = useState<string>()

  const row = rankingsPerGradeLevel.find((r) => r.studentId === selectedRowId)

  const chartData = row?.subjectGrades.map((s) => ({
    subject: s.subjectCode,
    grade: Math.round(s.finalGrade),
  }))

  return (
    <>
      <GenerateCertificateGradeLevel
        rankingsPerGradeLevel={rankingsPerGradeLevel}
      />
      <div className="flex gap-6">
        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Section</TableHead>
              <TableHead className="text-center">General Ave.</TableHead>
              <TableHead className="text-center">Remark</TableHead>
              <TableHead className="text-center">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankingsPerGradeLevel.length ? (
              rankingsPerGradeLevel.map((row) => (
                <TableRow
                  key={`ranking-per-grade-level-${row.studentId}`}
                  className="hover:bg-transparent"
                >
                  <TableCell className="whitespace-nowrap">
                    <p>{row.studentName}</p>
                    <p className="text-muted-foreground text-xs">
                      {row.gender}
                    </p>
                  </TableCell>
                  <TableCell>{row.sectionName}</TableCell>
                  <TableCell className="text-center">
                    {Math.round(row.allSubjectAverage)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getRemark(row.allSubjectAverage)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      aria-label="View breakdown"
                      size="iconXs"
                      variant="ghost"
                      onClick={() => setSelectedRowId(row.studentId)}
                    >
                      <BarChart2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} height={300}>
                  <div className="text-muted-foreground flex flex-col justify-center text-center">
                    <span>
                      <ChartBarIcon strokeWidth={1} className="inline-block" />
                    </span>
                    <p>No data to show.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {row ? (
          <Card className="relative shrink-0 rounded-md">
            <Button
              type="button"
              aria-label="Close breakdown"
              size="iconXs"
              variant="ghost"
              className="absolute right-4 top-4"
              onClick={() => setSelectedRowId(undefined)}
            >
              <XIcon />
            </Button>
            <CardHeader>
              <CardTitle>Average Grade Breakdown</CardTitle>
              <CardDescription>{row.studentName}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="grade" fill="var(--color-grade)" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing the breakdown the general average by of subject grades.
              </div>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </>
  )
}

function RankingBySectionContent({
  studentsWithGrades,
}: {
  studentsWithGrades: RankingsQueryResponse["rankingsPerSection"][number]["subjectsWithGrades"][number]["studentsWithGrades"]
}) {
  const [selectedRowId, setSelectedRowId] = useState<string>()

  const row = studentsWithGrades.find((r) => r.studentId === selectedRowId)

  const chartData = row?.periodicFinalGrades.map((s) => ({
    period: s.periodName,
    grade: Math.round(s.periodicGrade),
  }))

  return (
    <>
      <div className="flex gap-6">
        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">General Ave.</TableHead>
              <TableHead className="text-center">Remark</TableHead>
              <TableHead className="text-center">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsWithGrades.length ? (
              studentsWithGrades.map((row) => (
                <TableRow
                  key={`ranking-per-grade-level-${row.studentId}`}
                  className="hover:bg-transparent"
                >
                  <TableCell className="whitespace-nowrap">
                    <p>{row.studentName}</p>
                    <p className="text-muted-foreground text-xs">
                      {row.gender}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {Math.round(row.finalAverageGrade)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getRemark(row.finalAverageGrade)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      aria-label="View breakdown"
                      size="iconXs"
                      variant="ghost"
                      onClick={() => setSelectedRowId(row.studentId)}
                    >
                      <BarChart2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} height={300}>
                  <div className="text-muted-foreground flex flex-col justify-center text-center">
                    <span>
                      <ChartBarIcon strokeWidth={1} className="inline-block" />
                    </span>
                    <p>No data to show.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {row ? (
          <Card className="relative shrink-0 rounded-md">
            <Button
              type="button"
              aria-label="Close breakdown"
              size="iconXs"
              variant="ghost"
              className="absolute right-4 top-4"
              onClick={() => setSelectedRowId(undefined)}
            >
              <XIcon />
            </Button>
            <CardHeader>
              <CardTitle>
                Subject Grade Breakdown for {row.subjectCode}
              </CardTitle>
              <CardDescription>{row.studentName}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 24,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="grade" fill="var(--color-grade)" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Showing the breakdown the subject grade per grading period.
              </div>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </>
  )
}

function GenerateCertificateGradeLevel({
  rankingsPerGradeLevel,
}: {
  rankingsPerGradeLevel: RankingsQueryResponse["rankingsPerGradeLevel"]
}) {
  const [pdfStatus, setPdfStatus] = useState<"loading" | "loaded">("loading")

  const pdfIframeRef = useRef<HTMLIFrameElement | null>(null)

  const schoolYearQuery = useSchoolYears()

  const searchParams = useSearchParams()

  const schoolYear = schoolYearQuery.data?.find(
    (d) => d.id === searchParams.get("schoolYear")
  )

  const certificatesQuery = useCertificateTemplates()

  const [selectedCertTemplateId, setSelectedCertTemplateId] = useState<string>()

  const certTemplate = certificatesQuery.data?.find(
    (c) => c.id === selectedCertTemplateId
  )

  useEffect(() => {
    if (!pdfIframeRef.current) return

    const iframe = pdfIframeRef.current

    iframe.addEventListener("load", () => setPdfStatus("loaded"))

    return () => {
      iframe?.removeEventListener("load", () => setPdfStatus("loaded"))
    }
  }, [])

  return (
    <>
      <Dialog
        open={selectedCertTemplateId !== undefined}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCertTemplateId(undefined)
          }
        }}
      >
        <DialogContent className="overflow-hidden sm:max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>Generate Certificates</DialogTitle>
            <DialogDescription>
              Generate certificates using template:{" "}
              <span className="font-medium text-white">
                {certTemplate?.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {pdfStatus === "loading" ? (
              <div className="absolute inset-0 z-10 flex aspect-video w-full flex-col items-center justify-center">
                <Loader2Icon className="size-5 animate-spin" />
                <p className="text-sm">Loading certificates...</p>
              </div>
            ) : null}
            {certTemplate && (
              <PDFViewer
                className="aspect-video w-full overflow-hidden"
                innerRef={pdfIframeRef}
              >
                <Document
                  title={certTemplate.name}
                  pageLayout="singlePage"
                  onRender={() => setPdfStatus("loaded")}
                >
                  {rankingsPerGradeLevel.map((row) => (
                    <CertificateTemplatePage
                      key={row.studentId}
                      schoolName={certTemplate.school.name}
                      name={row.studentName}
                      average={Math.round(row.allSubjectAverage)}
                      rank={getRemark(row.allSubjectAverage)}
                      schoolYear={schoolYear?.title}
                      details={{
                        name: certTemplate.name,
                        frameSrc: certTemplate.frameSrc,
                        logo1: certTemplate.logo1,
                        logo2: certTemplate.logo2,
                        headingLine1: certTemplate.headingLine1,
                        headingLine2: certTemplate.headingLine2,
                        headingLine3: certTemplate.headingLine3,
                        headingLine4: certTemplate.headingLine4,
                        mainTitle: certTemplate.mainTitle,
                        bodyLine1: certTemplate.bodyLine1,
                        bodyLine2: certTemplate.bodyLine2,
                        bodyLine3: certTemplate.bodyLine3,
                        signatories:
                          certTemplate.signatories as CertificateInputs["signatories"],
                      }}
                    />
                  ))}
                </Document>
              </PDFViewer>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-3 flex justify-end">
        <Select
          key={certTemplate?.id}
          disabled={
            certificatesQuery.isLoading || rankingsPerGradeLevel.length === 0
          }
          value={selectedCertTemplateId}
          onValueChange={setSelectedCertTemplateId}
        >
          <SelectTrigger className="w-max min-w-[180px]">
            <SelectValue placeholder="Generate Certificates" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectLabel>Select template</SelectLabel>
              {certificatesQuery.data?.map((cert) => (
                <SelectItem key={cert.id} value={cert.id}>
                  {cert.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
