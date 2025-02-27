import * as z from "zod"

export const schoolYearSchema = z.object({
  title: z.string().nonempty({ message: "Title is required." }),
  programOfferingId: z.string().nonempty({ message: "Program is required." }),
  semesters: z
    .object({
      title: z.string().nonempty({ message: "Semester name is required." }),
    })
    .array()
    .min(1, { message: "Must have at least 1 semester per school year." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.title.toLowerCase())
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Semester name already exists.",
          path: [errorPosition, "title"],
        })
      }
    }),
})

export type SchoolYearInputs = z.infer<typeof schoolYearSchema>
