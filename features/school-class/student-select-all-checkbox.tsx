"use client"

import { useEffect } from "react"
import { Student } from "@prisma/client"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Table } from "@tanstack/react-table"
import { useFormContext } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

import { SchoolClassInputs } from "./schema"

export function StudentSelectAllCheckbox({ table }: { table: Table<Student> }) {
  const form = useFormContext<SchoolClassInputs>()

  useEffect(() => {
    const rows = table.getCoreRowModel().rows.map((row) => row.original.id)

    const selected = form.getValues("studentIds").map((s) => s.studentId)

    if (rows.length === selected.length) {
      table.toggleAllRowsSelected(true)
    }
  }, [])

  function handleCheckedChange(checked: CheckedState) {
    table.toggleAllRowsSelected(!!checked)

    form.clearErrors("studentIds")

    // get all rows in every page
    const rows = table
      .getCoreRowModel()
      .rows.map((row) => ({ studentId: row.original.id }))

    if (checked) {
      form.setValue("studentIds", rows)
    } else {
      form.setValue("studentIds", [])
    }
  }

  return (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      disabled={table.getCoreRowModel().rows.length === 0}
      onCheckedChange={handleCheckedChange}
      aria-label="Select all"
    />
  )
}
