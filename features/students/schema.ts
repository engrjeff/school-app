import { Gender } from "@prisma/client"
import * as z from "zod"

export const studentSchema = z.object({
  studentId: z.string().nonempty({ message: "Student ID (LRN) is required." }),
  firstName: z.string().nonempty({ message: "First name is required." }),
  lastName: z.string().nonempty({ message: "Last name is required." }),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  birthdate: z.string(),
  gender: z.nativeEnum(Gender, { message: "Invalid gender." }),
  address: z.string().nonempty({ message: "Address is required." }),
  phone: z.string().optional(),
  email: z
    .union([z.literal(""), z.string().email({ message: "Invalid email." })])
    .optional(),

  currentCourseId: z.string().trim().optional(),
  currentGradeYearLevelId: z.string().trim().optional(),
})

export type StudentInputs = z.infer<typeof studentSchema>

export const importStudentSchema = studentSchema
  .array()
  .superRefine((items, ctx) => {
    const uniqueItemsCount = new Set(
      items.map((item) => item.studentId.toLowerCase())
    ).size

    const errorPosition = items.length - 1

    if (uniqueItemsCount !== items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cannot have duplicate student ID or LRN: ${items[errorPosition].studentId}`,
        path: [errorPosition, "studentId"],
      })
    }
  })
