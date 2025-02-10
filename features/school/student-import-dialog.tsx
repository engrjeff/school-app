"use client"

import { ChangeEvent, useId, useState } from "react"
import { importStudents } from "@/features/students/actions"
import { Gender } from "@prisma/client"
import {
  ChevronDown,
  CircleAlert,
  Grid2x2Check,
  ImportIcon,
  Loader2,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ZodError } from "zod"

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
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { importStudentSchema, StudentInputs } from "../students/schema"
import { StudentImportPreviewTable } from "./student-import-preview-table"

export function StudentImportDialog() {
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
                Upload a{" "}
                <Badge className="border-secondary bg-secondary/30 px-0.5 font-mono">
                  .xlsx
                </Badge>{" "}
                or{" "}
                <Badge className="border-secondary bg-secondary/30 px-0.5 font-mono">
                  .csv
                </Badge>{" "}
                file.
              </div>
            </DialogDescription>
          </DialogHeader>
          <ImportDialogContent
            key={contentKey}
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

function ImportDialogContent({ onAfterSave }: { onAfterSave: VoidFunction }) {
  const id = useId()

  const [fileLoading, setFileLoading] = useState(false)

  const [studentData, setStudentData] = useState<StudentInputs[] | null>(null)

  const [view, setView] = useState<"upload" | "preview" | "error">("upload")

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
          "suffix",
          "birthdate",
          "gender",
          "address",
          "email",
          "phone",
        ],
      })

      const validatedData = importStudentSchema.safeParse(
        sheetData.slice(1).map((d) => ({
          studentId: d.studentId,
          firstName: d.firstName,
          lastName: d.lastName,
          suffix: d.suffix,
          birthdate: d.birthdate,
          gender: mapGender(d.gender),
          address: d.address,
          email: d.email,
          phone: d.phone,
        }))
      )

      if (validatedData.success) {
        setView("preview")
        setStudentData(validatedData.data)
      } else {
        setValidationErrors(validatedData.error)
        setView("error")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!studentData?.length) return

    const result = await importAction.executeAsync(studentData)

    if (result?.validationErrors) {
      toast.error("Check invalid row data entry.")
      return
    }

    if (result?.data?.students) {
      toast.success(
        `${result.data.students.count} students were successfully imported.`
      )
      onAfterSave()
    }
  }

  return (
    <div className="overflow-auto">
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
      {view === "upload" && (
        <label
          htmlFor={id}
          className="hover:bg-accent flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed"
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

function mapGender(gender: string) {
  if (gender.toLowerCase() === "male") return Gender.MALE

  if (gender.toLowerCase() === "female") return Gender.FEMALE

  return gender
}
