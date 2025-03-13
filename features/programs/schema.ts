import * as z from "zod"

export const commonProgramsSchema = z.object({
  programs: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      code: z.string(),
      gradingPeriod: z.string().array(),
      courses: z
        .object({
          title: z.string(),
          code: z.string(),
          subjects: z
            .object({
              title: z.string(),
              code: z.string().optional(),
            })
            .array(),
        })
        .array(),
    })
  ),
})

export type CommonProgramsInput = z.infer<typeof commonProgramsSchema>

export const commonCoursesSchema = z.object({
  courses: z
    .object({
      title: z.string(),
      code: z.string(),
      subjects: z
        .object({
          title: z.string(),
          code: z.string().optional(),
        })
        .array(),
    })
    .array(),
})

export type CommonCoursesInput = z.infer<typeof commonCoursesSchema>

export const programSchema = z.object({
  title: z
    .string({ required_error: "Program title is required." })
    .nonempty({ message: "Program title is required." }),
  description: z
    .string({ required_error: "Program description is required." })
    .nonempty({ message: "Program description is required." }),
  code: z
    .string({ required_error: "Program code is required." })
    .nonempty({ message: "Program code is required." }),
})

export const updateProgramSchema = programSchema.extend({
  id: z
    .string({ required_error: "Program ID is required." })
    .nonempty({ message: "Program ID is required." }),
})

export type ProgramInput = z.infer<typeof programSchema>
