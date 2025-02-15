import * as z from "zod"

export const sectionSchema = z.object({
  name: z.string().nonempty({ message: "Section name is required." }),
  order: z.number().int().positive(),
  gradeYearLevelId: z
    .string()
    .nonempty({ message: "Grade/Year level is required." }),
})

export type SectionInput = z.infer<typeof sectionSchema>

export const sectionArraySchema = sectionSchema
  .array()
  .superRefine((items, ctx) => {
    const uniqueItemsCount = new Set(
      items.map((item) => item.name.toLowerCase())
    ).size

    const errorPosition = items.length - 1

    if (uniqueItemsCount !== items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${items[errorPosition].name} already exists.`,
        path: [errorPosition, "name"],
      })
    }
  })

export const bulkSectionSchema = z.object({
  sections: sectionArraySchema,
})

export type BulkSectionInput = z.infer<typeof bulkSectionSchema>

export const requireSectionIdSchema = z.object({
  id: z.string().nonempty({ message: "ID is required." }),
})

export const updateSectionSchema = sectionSchema.merge(requireSectionIdSchema)

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>

export const reorderSectionSchema = sectionSchema
  .merge(requireSectionIdSchema)
  .array()
