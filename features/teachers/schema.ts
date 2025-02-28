import { Gender } from "@prisma/client"
import * as z from "zod"

export const teacherSchema = z.object({
  programOfferingId: z.string().nonempty({ message: "Program is required." }),
  facultyId: z
    .string()
    .nonempty({ message: "Faculty/Department is required." }),
  teacherId: z.string().nonempty({ message: "Teacher ID is required." }),
  firstName: z.string().nonempty({ message: "First name is required." }),
  lastName: z.string().nonempty({ message: "Last name is required." }),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  designation: z.string().nonempty({ message: "Designation is required." }),
  gender: z.nativeEnum(Gender, { message: "Invalid gender." }),
  address: z.string().nonempty({ message: "Address is required." }),
  phone: z.string().nonempty({ message: "Phone is required." }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Invalid email." }),
  profilePicture: z
    .union([z.literal(""), z.string().url({ message: "Invalid image URL." })])
    .optional(),
})

export type TeacherInputs = z.infer<typeof teacherSchema>

export const teacherArraySchema = teacherSchema
  .omit({ programOfferingId: true, facultyId: true })
  .array()
  .superRefine((items, ctx) => {
    const uniqueItemsCount = new Set(
      items.map((item) => item.teacherId.toLowerCase())
    ).size

    const errorPosition = items.length - 1

    if (uniqueItemsCount !== items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cannot have duplicate teacher ID: ${items[errorPosition].teacherId}`,
        path: [errorPosition, "teacherId"],
      })
    }
  })

export type TeacherArrayInputs = z.infer<typeof teacherArraySchema>

export const importTeacherSchema = z.object({
  programOfferingId: z.string().nonempty({ message: "Program is required." }),
  facultyId: z
    .string()
    .nonempty({ message: "Faculty/Department is required." }),
  teachers: teacherArraySchema,
})

export type ImportTeacherInputs = z.infer<typeof importTeacherSchema>

export const requireTeacherIdSchema = z.object({
  id: z
    .string({ required_error: "Teacher ID is required." })
    .nonempty({ message: "Teacher ID is required." }),
})

export const updateTeacherSchema = teacherSchema
  .omit({ programOfferingId: true, facultyId: true })
  .merge(requireTeacherIdSchema)
