"use client"

import { Student } from "@prisma/client"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Row } from "@tanstack/react-table"
import { useFieldArray, useFormContext } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"

import { SchoolClassInputs } from "./schema"

export function StudentRowCheckbox({ row }: { row: Row<Student> }) {
  const form = useFormContext<SchoolClassInputs>()

  const studentFields = useFieldArray({
    control: form.control,
    name: "studentIds",
  })

  function handleCheckedChange(checked: CheckedState) {
    row.toggleSelected(!!checked)

    const studentId = row.original.id

    if (checked) {
      studentFields.append({ studentId: studentId })
    } else {
      const index = form
        .getValues()
        .studentIds.indexOf({ studentId: studentId })
      studentFields.remove(index)
    }
  }

  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={handleCheckedChange}
      aria-label="Select row"
    />
  )
}
