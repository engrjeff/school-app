import { Gender, Teacher } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(inputStr: string) {
  return inputStr
    .split(" ")
    .map((s) => s.at(0))
    .join("")
}

export function arrayToMap<T>(
  arr: T[],
  keyProperty: keyof T,
  valueKey: keyof T
) {
  return new Map(arr.map((entry) => [entry[keyProperty], entry[valueKey]]))
}

export function mapGender(gender: string) {
  if (gender.toLowerCase() === "male") return Gender.MALE

  if (gender.toLowerCase() === "female") return Gender.FEMALE

  return gender
}

export function toProperPhoneNumber(phone: string) {
  return phone.startsWith("09") || phone.startsWith("+639")
    ? phone
    : `+63${phone}`
}

export function findDuplicatePositions(
  arr: string[]
): Record<string, number[]> {
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

export type EntryError = {
  item: string | null | undefined
  row: number
  invalid: boolean
  reason: string | null
}

export function validateItems(
  arr: (string | null | undefined)[],
  currentArr: string[]
): EntryError[] {
  const duplicatePositions = findDuplicatePositions(arr as string[])

  return arr.map((item, i) => {
    if (!item) {
      return { item, row: i + 1, invalid: true, reason: "Blank entry" }
    }

    if (currentArr.includes(item.toLowerCase())) {
      return {
        item,
        row: i + 1,
        invalid: true,
        reason: "Already exists",
      }
    }
    return {
      item,
      row: i + 1,
      invalid: duplicatePositions.hasOwnProperty(item.toLowerCase()),
      reason: duplicatePositions.hasOwnProperty(item.toLowerCase())
        ? "With duplicate(s)"
        : null,
    }
  })
}

export function getTeacherFullName(teacher: Teacher) {
  return [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
    teacher.suffix,
  ]
    .filter(Boolean)
    .join(" ")
}
