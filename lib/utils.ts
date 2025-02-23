import { Gender } from "@prisma/client"
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
