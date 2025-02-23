import * as z from "zod"

export const facultySchema = z.object({
  programOfferingId: z
    .string()
    .nonempty({ message: "Program Offering is required." }),
  title: z
    .string()
    .nonempty({ message: "Faculty/Department name is required." }),
  description: z.string().optional(),
})

export type FacultyInputs = z.infer<typeof facultySchema>

export const facultyArraySchema = facultySchema
  .array()
  .superRefine((items, ctx) => {
    const uniqueItemsCount = new Set(
      items.map((item) => item.title.toLowerCase())
    ).size

    const errorPosition = items.length - 1

    if (uniqueItemsCount !== items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${items[errorPosition].title} already exists.`,
        path: [errorPosition, "title"],
      })
    }
  })

export const bulkFacultySchema = z.object({
  faculties: facultyArraySchema,
})

export type BulkFacultyInputs = z.infer<typeof bulkFacultySchema>

export const requireFacultyIdSchema = z.object({
  id: z.string().nonempty({ message: "ID is required." }),
})

export const updateFacultySchema = facultySchema.merge(requireFacultyIdSchema)

export type UpdateFacultyInputs = z.infer<typeof updateFacultySchema>
