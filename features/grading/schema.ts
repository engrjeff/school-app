import * as z from "zod"

export const gradeComponentPartSchema = z.object({
  order: z.number().int().positive(),
  title: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  highestPossibleScore: z
    .number()
    .gt(0, { message: "Must be greater than zero." }),
})

export type GradeComponentPartInputs = z.infer<typeof gradeComponentPartSchema>

export const gradeComponentSchema = z.object({
  label: z
    .string({ required_error: "Label is required." })
    .nonempty({ message: "Label is required." }),
  title: z
    .string({ required_error: "Title is required." })
    .nonempty({ message: "Title is required." }),
  percentage: z
    .number({ invalid_type_error: "Percentage is required." })
    .gt(0, { message: "Must be greater than zero." })
    .lte(1, { message: "Must NOT be less than or equal to 1.0" }),
  parts: gradeComponentPartSchema
    .array()
    .min(1, { message: "Must have at least 1 grade sub-component." }),
})

export type GradeComponentInputs = z.infer<typeof gradeComponentSchema>

export const gradeComponentIdSchema = z.object({
  id: z
    .string({ required_error: "Grade component ID is required." })
    .nonempty({ message: "Grade component ID is required." }),
})

export const updateGradeComponentSchema = gradeComponentSchema
  .omit({ parts: true })
  .merge(gradeComponentIdSchema)

export const gradeComponentPickerSchema = z.object({
  gradeComponents: z
    .object({
      id: z.string({ required_error: "Required." }),
    })
    .array()
    .min(1, { message: "Please select grade components." }),
})

export type GradeComponentPickerInputs = z.infer<
  typeof gradeComponentPickerSchema
>

export const assignGradeComponentsSchema = z
  .object({
    classId: z.string({ required_error: "Class ID is required." }),
  })
  .merge(gradeComponentPickerSchema)

export const gradeComponentPartScoreSchema = z.object({
  scoreId: z.string().optional(),
  studentGradeId: z.string().optional(),
  gradingPeriodId: z
    .string({ required_error: "Grading period is required." })
    .nonempty({ message: "Grading period is required." }),
  studentId: z
    .string({ required_error: "Student ID is required." })
    .nonempty({ message: "Student ID is required." }),
  score: z.preprocess((arg) => {
    if (isNaN(arg as number)) return undefined

    if (typeof arg === "string" && arg === "") {
      return undefined
    } else {
      return arg
    }
  }, z.number().optional()),
  gradeComponentPartId: z
    .string({ required_error: "Grading subcomponent is required." })
    .nonempty({ message: "Grading subcomponent is required." }),
  parentGradeComponentId: z
    .string({ required_error: "Grading component is required." })
    .nonempty({ message: "Grading component is required." }),
})

export type GradeComponentPartScoreInputs = z.infer<
  typeof gradeComponentPartScoreSchema
>
