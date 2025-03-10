"use client"

import { ChangeEvent, useState } from "react"
import { Section } from "@prisma/client"
import { CircleAlert, CircleCheckIcon, ImportIcon, Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ZodError } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { importSections } from "./actions"
import { BulkSectionInput, sectionArraySchema } from "./schema"

export function SectionImportForm({
  gradeYearLevelId,
  currentSections,
  onCancel,
}: {
  gradeYearLevelId: string
  currentSections: Section[]

  onCancel: VoidFunction
}) {
  const [fileLoading, setFileLoading] = useState(false)

  const [view, setView] = useState<"upload" | "preview" | "error">("upload")

  const [sectionSheetData, setSectionSheetData] =
    useState<Array<{ name: string; order: number; gradeYearLevelId: string }>>()

  const [validationErrors, setValidationErrors] =
    useState<ZodError<BulkSectionInput["sections"]>>()

  const [rowEntryErrors, setRowEntryErrors] = useState<EntryError[]>()

  const importAction = useAction(importSections, {
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error(error.serverError)
      }
      if (error.validationErrors) {
        toast.error("Check invalid row data entry.")
      }
    },
  })

  const nextOrder = currentSections.length

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

      const sheetData = XLSX.utils.sheet_to_json<{ name: string }>(sheet, {
        raw: false,
        header: ["name"],
        blankrows: true,
      })

      const data = sheetData.slice(1).map((d, i) => ({
        name: d.name,
        order: nextOrder + i + 1,
        gradeYearLevelId,
      }))

      const entryErrors = validateItems(
        data.map((d) => d.name),
        currentSections.map((s) => s.name.trim().toLowerCase())
      )

      if (entryErrors.some((e) => e.invalid)) {
        setView("error")
        setRowEntryErrors(entryErrors)
        return
      }

      const validatedData = sectionArraySchema.safeParse(data)

      if (validatedData.success) {
        setView("preview")
        setSectionSheetData(validatedData.data)
      } else {
        console.log(validatedData.error)
        setValidationErrors(validatedData.error)
        setView("error")
      }
    }

    reader.readAsArrayBuffer(file)
  }

  async function handleImport() {
    if (!sectionSheetData?.length) return

    const result = await importAction.executeAsync({
      sections: sectionSheetData,
    })

    if (result?.validationErrors) {
      toast.error("Check invalid row data entry.")
      return
    }

    if (result?.data?.sections) {
      toast.success(
        `${result.data.sections.count} sections were successfully imported.`
      )

      onCancel()

      window.location.reload()
    }
  }

  return (
    <Card className="border-none">
      <CardContent className="px-0">
        {view === "upload" ? (
          <label
            htmlFor="section-import"
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
              name="section-import"
              id="section-import"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
          </label>
        ) : null}

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
                    <TableHead className="h-11">Name</TableHead>
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

        {view === "preview" && sectionSheetData?.length && (
          <div className="space-y-4 overflow-hidden">
            <div className="bg-accent rounded border border-l-2 border-l-emerald-500 px-4 py-3">
              <p className="text-sm">
                <CircleCheckIcon
                  className="-mt-0.5 me-3 inline-flex text-emerald-500"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Parsed {sectionSheetData.length} rows.
              </p>
            </div>

            <div className="max-h-[400px] w-full max-w-full overflow-auto ">
              <Table className="[&_td]:border-border [&_th]:border-border table-auto border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
                <TableHeader className="sticky top-0 z-10 backdrop-blur-sm">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-11">Name</TableHead>
                    <TableHead className="h-11">Validity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionSheetData?.map((item, index) => (
                    <TableRow key={`section-${index + 1}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <CircleCheckIcon className="size-4 text-green-500" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 p-0">
        {view === "upload" ? null : (
          <Button
            type="button"
            size="sm"
            variant="secondaryOutline"
            onClick={() => {
              setValidationErrors(undefined)
              setSectionSheetData(undefined)
              setView("upload")
            }}
            disabled={importAction.isPending}
            className="self-start"
          >
            Change File
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="secondaryOutline"
          onClick={onCancel}
          disabled={importAction.isPending}
          className="ml-auto"
        >
          Cancel
        </Button>
        <SubmitButton
          type="submit"
          size="sm"
          disabled={view !== "preview"}
          loading={importAction.isPending}
          onClick={handleImport}
        >
          Save
        </SubmitButton>
      </CardFooter>
    </Card>
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
