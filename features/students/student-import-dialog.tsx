"use client"

import { ChangeEvent, useId, useState } from "react"
import { importStudents } from "@/features/students/actions"
import { Student } from "@prisma/client"
import {
  ChevronDown,
  CircleAlert,
  CircleCheckIcon,
  Grid2x2Check,
  ImportIcon,
  Info,
  Loader2,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ZodError } from "zod"

import { EntryError, mapGender, validateItems } from "@/lib/utils"
import { useCourses } from "@/hooks/use-courses"
import { useGradeYearLevels } from "@/hooks/use-grade-levels"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { importStudentSchema, StudentInputs } from "./schema"
import { StudentImportPreviewTable } from "./student-import-preview-table"

export function StudentImportDialog({
  currentStudents,
}: {
  currentStudents: Student[]
}) {
  const [open, setOpen] = useState(false)

  const contentKey = useId()

  return (
    <div className="flex items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="secondaryOutline"
            className="rounded-r-none"
          >
            <ImportIcon /> Import
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden sm:max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>Import Students</DialogTitle>
            <DialogDescription asChild>
              <div>
                Upload a <Badge variant="code">.xlsx</Badge> or{" "}
                <Badge variant="code">.csv</Badge> file.
              </div>
            </DialogDescription>
          </DialogHeader>
          <ImportDialogContent
            key={contentKey}
            onAfterSave={() => setOpen(false)}
            currentStudents={currentStudents}
          />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="iconXs"
            variant="secondaryOutline"
            className="rounded-l-none border-l-0"
          >
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href="/templates/edumetrics-student-import-template.xlsx"
              download
              target="_blank"
            >
              <Grid2x2Check
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              Download Template
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function ImportDialogContent({
  onAfterSave,
  currentStudents,
}: {
  onAfterSave: VoidFunction
  currentStudents: Student[]
}) {
  const id = useId()

  const [fileLoading, setFileLoading] = useState(false)

  const [view, setView] = useState<
    "upload" | "preview" | "error" | "row-error"
  >("upload")

  const [studentData, setStudentData] = useState<StudentInputs[] | null>(null)

  const [rowEntryErrors, setRowEntryErrors] = useState<EntryError[]>()

  // optional fields
  const [course, setCourse] = useState<string>()
  const [gradeYearLevel, setGradeYearLevel] = useState<string>()

  const courses = useCourses()
  const gradeYearLevels = useGradeYearLevels(course)

  const [validationErrors, setValidationErrors] =
    useState<ZodError<StudentInputs[]>>()

  const importAction = useAction(importStudents, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
      if (error.validationErrors) {
        toast.error("Check invalid row data entry.")
      }
    },
  })

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    const file = files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadstart = () => {
      setFileLoading(true)
    }

    reader.onloadend = () => {
      setFileLoading(false)
    }

    reader.onload = (event) => {
      if (!event.target?.result) return

      const workbook = XLSX.read(event.target.result, {
        type: "binary",
        cellDates: true,
      })

      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      const sheetData = XLSX.utils.sheet_to_json<StudentInputs>(sheet, {
        raw: false,
        header: [
          "studentId",
          "firstName",
          "lastName",
          "middleName",
          "suffix",
          "birthdate",
          "gender",
          "address",
          "email",
          "phone",
        ],
      })

      const entryErrors = validateItems(
        sheetData.slice(1).map((d) => d.studentId),
        currentStudents.map((f) => f.studentId.trim().toLowerCase())
      )

      if (entryErrors.some((e) => e.invalid)) {
        setView("row-error")
        setRowEntryErrors(entryErrors.filter((e) => e.invalid))
        return
      }

      const validatedData = importStudentSchema.safeParse(
        sheetData.slice(1).map((d) => ({
          studentId: d.studentId,
          firstName: d.firstName,
          lastName: d.lastName,
          middleName: d.middleName,
          suffix: d.suffix,
          birthdate: d.birthdate,
          gender: mapGender(d.gender),
          address: d.address,
          email: d.email,
          phone: d.phone,
          currentCourseId: course,
          currentGradeYearLevelId: gradeYearLevel,
        }))
      )

      if (validatedData.success) {
        setView("preview")
        setStudentData(validatedData.data)
        toast.success(`Parsed ${validatedData.data.length} rows.`)
      } else {
        setValidationErrors(validatedData.error)
        setView("error")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!studentData?.length) return

    if (!course || !gradeYearLevel) {
      toast.error(`Select a course and grade level.`)
      return
    }

    const result = await importAction.executeAsync(studentData)

    if (result?.validationErrors) {
      toast.error("Check invalid row data entry.")
      return
    }

    if (result?.data?.students) {
      toast.success(
        `${studentData.length} students were successfully imported.`
      )

      onAfterSave()

      window.location.reload()
    }
  }

  return (
    <div className="space-y-4 overflow-auto">
      {view === "upload" && (
        <div className="bg-accent rounded border border-l-2 border-l-blue-500 px-4 py-3">
          <p className="text-sm">
            <Info
              className="-mt-0.5 me-3 inline-flex text-blue-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            It is advisable to import students by the course in which they are
            listed or registered.
          </p>
        </div>
      )}
      {view === "row-error" && (
        <div className="max-h-[350px] w-full max-w-full overflow-auto ">
          <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
            <TableHeader className="sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11">Row #</TableHead>
                <TableHead className="h-11">Student ID</TableHead>
                <TableHead className="h-11">Issue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowEntryErrors?.map((error, errIndex) => (
                <TableRow key={`error-${errIndex + 1}`}>
                  <TableCell>{error.row}</TableCell>
                  <TableCell>{error.item}</TableCell>
                  <TableCell>
                    {error.invalid ? (
                      <span className="text-red-500">{error.reason}</span>
                    ) : (
                      <CircleCheckIcon className="size-4 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {view === "error" && (
        <div className="space-y-4 overflow-hidden">
          <div className="bg-accent flex items-center gap-4 rounded border border-l-2 border-l-red-500 px-4 py-3">
            <CircleAlert
              className="inline-flex text-red-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-sm">
              The data contains <span>{validationErrors?.errors.length}</span>{" "}
              invalid row entries. Fix them first before continuing.
              <br />
              <span className="text-muted-foreground">
                Once the row entries have been fixed, you may reupload the
                corrected file.
              </span>
            </p>
          </div>

          <div className="max-h-[400px] w-full max-w-full overflow-auto ">
            <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
              <TableHeader className="sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11">Row #</TableHead>
                  <TableHead className="h-11">Invalid Fields</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationErrors?.issues?.map((error, errIndex) => (
                  <TableRow key={`error-${errIndex + 1}`}>
                    <TableCell>{Number(error.path[0]) + 1}</TableCell>
                    <TableCell>{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 items-center gap-4 px-1">
        <div>
          <Label htmlFor="course" className="mb-2 inline-block">
            Course
          </Label>
          <Select
            name="course"
            disabled={courses.isLoading}
            value={course}
            onValueChange={(courseValue) => {
              setGradeYearLevel(undefined)
              setCourse(courseValue)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.data?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gradeYearLevel" className="mb-2 inline-block">
            Grade/Year Level
          </Label>
          <Select
            name="gradeYearLevel"
            value={gradeYearLevel}
            onValueChange={setGradeYearLevel}
            disabled={!course || gradeYearLevels.isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade/year level" />
            </SelectTrigger>
            <SelectContent>
              {gradeYearLevels.data?.map((g) => (
                <SelectItem value={g.id}>
                  {g.displayName} {g.level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {view === "upload" && (
        <fieldset
          disabled={!course || !gradeYearLevel}
          className="group disabled:cursor-not-allowed"
        >
          <label
            htmlFor={id}
            className="hover:bg-accent flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed group-disabled:cursor-not-allowed group-disabled:hover:bg-transparent"
          >
            {fileLoading ? (
              <>
                <Loader2
                  strokeWidth={1.5}
                  className="text-muted-foreground size-5 animate-spin"
                />
                <span className="text-muted-foreground text-center text-sm">
                  Loading file...
                </span>
              </>
            ) : (
              <>
                <ImportIcon
                  strokeWidth={1.5}
                  className="text-muted-foreground size-5"
                />
                <span className="text-muted-foreground text-center text-sm">
                  Select a file
                </span>
              </>
            )}
            <input
              type="file"
              hidden
              name={id}
              id={id}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
          </label>
        </fieldset>
      )}

      {view === "preview" && studentData?.length && (
        <StudentImportPreviewTable studentPreviewData={studentData} />
      )}
      <DialogFooter className="mt-6">
        {view !== "upload" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStudentData(null)
              setValidationErrors(undefined)
              setView("upload")
            }}
            disabled={importAction.isPending}
          >
            Change File
          </Button>
        ) : (
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        )}
        <SubmitButton
          type="button"
          disabled={!studentData?.length}
          loading={importAction.isPending}
          onClick={handleImport}
        >
          Import
        </SubmitButton>
      </DialogFooter>
    </div>
  )
}
