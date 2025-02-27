"use client"

import { ChangeEvent, useId, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Faculty, ProgramOffering, Teacher } from "@prisma/client"
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

import {
  EntryError,
  mapGender,
  toProperPhoneNumber,
  validateItems,
} from "@/lib/utils"
import { useFaculties } from "@/hooks/use-faculties"
import { useProgramOfferings } from "@/hooks/use-program-offerings"
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

import { importTeachers } from "./actions"
import {
  ImportTeacherInputs,
  TeacherArrayInputs,
  teacherArraySchema,
} from "./schema"
import { TeacherImportPreviewTable } from "./teacher-import-preview-table"

type TeacherEntries = Array<
  Teacher & { programs: ProgramOffering[]; faculties: Faculty[] }
>

export function TeacherImportDialog({
  currentTeachers,
}: {
  currentTeachers: TeacherEntries
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
            <DialogTitle>Import Teacher Data</DialogTitle>
            <DialogDescription asChild>
              <div>
                Upload a <Badge variant="code">.xlsx</Badge> or{" "}
                <Badge variant="code">.csv</Badge> file.
              </div>
            </DialogDescription>
          </DialogHeader>
          <ImportDialogContent
            key={contentKey}
            currentTeachers={currentTeachers}
            onAfterSave={() => setOpen(false)}
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
              href="/templates/edumetrics-teacher-import-template.xlsx"
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
  currentTeachers,
  onAfterSave,
}: {
  currentTeachers: TeacherEntries
  onAfterSave: VoidFunction
}) {
  const id = useId()

  const [fileLoading, setFileLoading] = useState(false)

  const searchParams = useSearchParams()

  const [programId, setProgramId] = useState(
    () => searchParams.get("program") ?? ""
  )

  const [facultyId, setFacultyId] = useState<string>("")

  const programs = useProgramOfferings()
  const faculties = useFaculties(programId)

  const [view, setView] = useState<"upload" | "preview" | "error">("upload")

  const [teachersData, setTeachersData] = useState<TeacherArrayInputs | null>(
    null
  )

  const [rowEntryErrors, setRowEntryErrors] = useState<EntryError[]>()

  const [validationErrors, setValidationErrors] =
    useState<ZodError<TeacherArrayInputs>>()

  const importAction = useAction(importTeachers, {
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

      const sheetData = XLSX.utils.sheet_to_json<
        ImportTeacherInputs["teachers"][number]
      >(sheet, {
        raw: false,
        header: [
          "teacherId",
          "firstName",
          "lastName",
          "middleName",
          "suffix",
          "designation",
          "birthdate",
          "gender",
          "address",
          "email",
          "phone",
        ],
      })

      const entryErrors = validateItems(
        sheetData.slice(1).map((d) => d.teacherId),
        currentTeachers.map((f) => f.teacherId.trim().toLowerCase())
      )

      if (entryErrors.some((e) => e.invalid)) {
        setView("error")
        setRowEntryErrors(entryErrors.filter((e) => e.invalid))
        return
      }

      const validatedData = teacherArraySchema.safeParse(
        sheetData.slice(1).map((d) => ({
          teacherId: d.teacherId,
          firstName: d.firstName,
          lastName: d.lastName,
          middleName: d.middleName,
          suffix: d.suffix,
          designation: d.designation,
          gender: mapGender(d.gender),
          address: d.address,
          email: d.email,
          phone: toProperPhoneNumber(d.phone),
        }))
      )

      if (validatedData.success) {
        setView("preview")
        setTeachersData(validatedData.data)
      } else {
        setValidationErrors(validatedData.error)
        setView("error")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!teachersData?.length) return

    if (!programId) {
      toast.error("Select a program and faculty first.")
      return
    }

    if (!facultyId) {
      toast.error("Select a program and faculty first.")
      return
    }

    const result = await importAction.executeAsync({
      programOfferingId: programId,
      facultyId: facultyId,
      teachers: teachersData,
    })

    if (result?.validationErrors) {
      toast.error("Check invalid row data entry.")
      return
    }

    if (result?.data?.teachers.length) {
      toast.success(
        `${result?.data?.teachers.length} teachers were successfully imported.`
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
            It is advisable to import teacher data by program and faculty.
          </p>
        </div>
      )}
      {view === "error" && (
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
      )}
      <div className="grid grid-cols-3 gap-4 px-1">
        <div>
          <Label htmlFor="program" className="mb-2 inline-block">
            Program{" "}
          </Label>
          <Select
            name="program"
            disabled={programs.isLoading}
            value={programId}
            onValueChange={(e) => {
              setProgramId(e)
              setFacultyId("")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              {programs.data?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="faculty" className="mb-2 inline-block">
            Faculty{" "}
          </Label>
          <Select
            name="faculty"
            disabled={faculties.isLoading || !programId}
            value={facultyId}
            onValueChange={setFacultyId}
            key={programId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a faculty" />
            </SelectTrigger>
            <SelectContent>
              {faculties.data?.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {view === "error" && (
        <div className="max-h-[400px] w-full max-w-full overflow-auto ">
          <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
            <TableHeader className="sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11">Row #</TableHead>
                <TableHead className="h-11">Teacher ID</TableHead>
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
      {view === "upload" && (
        <fieldset
          disabled={!programId || !facultyId}
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

      {view === "preview" && teachersData?.length && (
        <TeacherImportPreviewTable teacherPreviewData={teachersData} />
      )}
      <DialogFooter className="mt-6">
        {view !== "upload" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTeachersData(null)
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
          disabled={!teachersData?.length}
          loading={importAction.isPending}
          onClick={handleImport}
        >
          Import
        </SubmitButton>
      </DialogFooter>
    </div>
  )
}
