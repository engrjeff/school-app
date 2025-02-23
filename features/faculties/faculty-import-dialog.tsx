"use client"

import { ChangeEvent, useId, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Faculty } from "@prisma/client"
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

import { importFaculties } from "./actions"
import { FacultyImportPreviewTable } from "./faculty-import-preview-table"
import { facultyArraySchema, FacultyInputs } from "./schema"

export function FacultyImportDialog({
  currentFaculties,
}: {
  currentFaculties: Faculty[]
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
            <DialogTitle>Import Faculty Data</DialogTitle>
            <DialogDescription asChild>
              <div>
                Upload a <Badge variant="code">.xlsx</Badge> or{" "}
                <Badge variant="code">.csv</Badge> file.
              </div>
            </DialogDescription>
          </DialogHeader>
          <ImportDialogContent
            key={contentKey}
            currentFaculties={currentFaculties}
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
              href="/templates/edumetrics-faculty-import-template.xlsx"
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
  currentFaculties,
  onAfterSave,
}: {
  currentFaculties: Faculty[]
  onAfterSave: VoidFunction
}) {
  const id = useId()

  const [fileLoading, setFileLoading] = useState(false)

  const searchParams = useSearchParams()

  const programs = useProgramOfferings()

  const [programId, setProgramId] = useState(
    () => searchParams.get("program") ?? ""
  )

  const [view, setView] = useState<"upload" | "preview" | "error">("upload")

  const [facultyData, setFacultyData] = useState<FacultyInputs[] | null>(null)

  const [rowEntryErrors, setRowEntryErrors] = useState<EntryError[]>()

  const [validationErrors, setValidationErrors] =
    useState<ZodError<FacultyInputs[]>>()

  const importAction = useAction(importFaculties, {
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

      const sheetData = XLSX.utils.sheet_to_json<FacultyInputs>(sheet, {
        raw: false,
        header: ["title", "description"],
      })

      const entryErrors = validateItems(
        sheetData.slice(1).map((d) => d.title),
        currentFaculties.map((f) => f.title.trim().toLowerCase())
      )

      if (entryErrors.some((e) => e.invalid)) {
        setView("error")
        setRowEntryErrors(entryErrors)
        return
      }

      const validatedData = facultyArraySchema.safeParse(
        sheetData.slice(1).map((d) => ({
          title: d.title,
          description: d.description,
          programOfferingId: programId,
        }))
      )

      if (validatedData.success) {
        setView("preview")
        setFacultyData(validatedData.data)
      } else {
        setValidationErrors(validatedData.error)
        setView("error")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!facultyData?.length) return

    const result = await importAction.executeAsync(facultyData)

    if (result?.validationErrors) {
      toast.error("Check invalid row data entry.")
      return
    }

    if (result?.data?.faculties.count) {
      toast.success(
        `${facultyData.length} faculties were successfully imported.`
      )

      onAfterSave()

      window.location.reload()
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
                  <TableHead className="h-11">Title</TableHead>
                  <TableHead className="h-11">Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowEntryErrors?.map((error, errIndex) => (
                  <TableRow key={`error-${errIndex + 1}`}>
                    <TableCell>{errIndex + 1}</TableCell>
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
        </div>
      )}
      {view === "upload" && (
        <div className="space-y-4">
          <div className="bg-accent rounded border border-l-2 border-l-blue-500 px-4 py-3">
            <p className="text-sm">
              <Info
                className="-mt-0.5 me-3 inline-flex text-blue-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              It is advisable to import faculy data by program.
            </p>
          </div>

          <div className="w-1/4 px-1">
            <Label htmlFor="course" className="mb-2 inline-block">
              Program{" "}
            </Label>
            <Select
              name="program"
              disabled={programs.isLoading}
              value={programId}
              onValueChange={setProgramId}
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
        </div>
      )}

      {view === "preview" && facultyData?.length && (
        <FacultyImportPreviewTable facultyPreviewData={facultyData} />
      )}
      <DialogFooter className="mt-6">
        {view !== "upload" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFacultyData(null)
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
          disabled={!facultyData?.length}
          loading={importAction.isPending}
          onClick={handleImport}
        >
          Import
        </SubmitButton>
      </DialogFooter>
    </div>
  )
}

function findDuplicatePositions(arr: string[]): Record<string, number[]> {
  const positions: Record<string, number[]> = {}
  const duplicates: Record<string, number[]> = {}

  arr.forEach((item, index) => {
    if (item) {
      const itemLower = item.toLowerCase()
      if (!positions[itemLower]) {
        positions[itemLower] = []
      }
      positions[itemLower].push(index)
    }
  })

  for (const key in positions) {
    if (positions[key].length > 1) {
      duplicates[key] = positions[key]
    }
  }

  return duplicates
}

type EntryError = {
  item: string | null | undefined
  invalid: boolean
  reason: string | null
}

function validateItems(
  arr: (string | null | undefined)[],
  currentArr: string[]
): EntryError[] {
  const duplicatePositions = findDuplicatePositions(arr as string[])

  return arr.map((item) => {
    if (!item) {
      return { item, invalid: true, reason: "Blank entry" }
    }

    if (currentArr.includes(item.toLowerCase())) {
      return {
        item,
        invalid: true,
        reason: "Already exists",
      }
    }
    return {
      item,
      invalid: duplicatePositions.hasOwnProperty(item.toLowerCase()),
      reason: duplicatePositions.hasOwnProperty(item.toLowerCase())
        ? "With duplicate(s)"
        : null,
    }
  })
}
