import * as z from "zod"

export const subjectSchema = z.object({
  title: z.string().nonempty({ message: "Subject title is required." }),
  code: z.string().nonempty({ message: "Subject code is required." }),
  courseId: z.string().nonempty({ message: "Course ID is required." }),
  description: z.string().optional(),
  units: z
    .number({ invalid_type_error: "Must be a number." })
    .gt(0, { message: "Must be greater than 0" }),
})

export type SubjectInputs = z.infer<typeof subjectSchema>

export const requireSubjectIdSchema = z.object({
  id: z
    .string({ required_error: "Subject id is required." })
    .nonempty({ message: "Subject id is required." }),
})

export const updateSubjectSchema = subjectSchema.merge(requireSubjectIdSchema)
