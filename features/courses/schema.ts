import * as z from "zod"

export const subjectSchema = z.object({
  title: z.string().nonempty({ message: "Subject title is required." }),
  code: z.string().nonempty({ message: "Subject code is required." }),
  schoolId: z.string().nonempty({ message: "School ID is required." }),
  description: z.string().optional(),
  units: z
    .number({ invalid_type_error: "Must be a number." })
    .gt(0, { message: "Must be greater than 0" }),
})

export const gradeYearLevelSchema = z.object({
  displayName: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  levels: z
    .object({
      level: z
        .string({ required_error: "Required." })
        .trim()
        .nonempty({ message: "Required." }),
    })
    .array()
    .min(1, { message: "Must have at least 1 level." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.level.toLowerCase())
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Level already exists.",
          path: [errorPosition, "level"],
        })
      }
    }),
})

export const courseSchema = z.object({
  title: z.string().nonempty({ message: "Course title is required." }),
  code: z.string().nonempty({ message: "Course code is required." }),
  programOfferingId: z.string().nonempty({ message: "Program is required." }),
  description: z.string().optional(),
  subjects: subjectSchema
    .array()
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.title.toLowerCase())
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject already exists.",
          path: [errorPosition, "title"],
        })
      }
    })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.code.toLowerCase())
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject code already exists.",
          path: [errorPosition, "code"],
        })
      }
    }),
  gradeYearLevels: gradeYearLevelSchema,
})

export type CourseInputs = z.infer<typeof courseSchema>

export type SubjectInputs = z.infer<typeof subjectSchema>
