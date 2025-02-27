import * as z from "zod"

export const schoolClassSchema = z.object({
  programOfferingId: z
    .string({ required_error: "Program is required." })
    .nonempty({ message: "Program is required." }),
  schoolYearId: z
    .string({ required_error: "School Year is required." })
    .nonempty({ message: "School Year is required." }),
  semesterId: z
    .string({ required_error: "Semester Year is required." })
    .nonempty({ message: "Semester is required." }),
  courseId: z
    .string({ required_error: "Course is required." })
    .nonempty({ message: "Course is required." }),
  gradeYearLevelId: z
    .string({ required_error: "Grade/Year level is required." })
    .nonempty({ message: "Grade/Year level is required." }),
  sectionId: z
    .string({ required_error: "Section is required." })
    .nonempty({ message: "Section is required." }),
  subjectId: z
    .string({ required_error: "Subject is required." })
    .nonempty({ message: "Subject is required." }),
  teacherId: z
    .string({ required_error: "Teacher is required." })
    .nonempty({ message: "Teacher is required." }),
  studentIds: z
    .object({
      studentId: z
        .string({ required_error: "Student ID is required." })
        .nonempty({ message: "Student ID is required." }),
    })
    .array()
    .min(1, { message: "Enroll at least one student." }),
  gradingPeriods: z
    .object({
      title: z
        .string({ required_error: "Grading period title is required." })
        .nonempty({ message: "Grading period title is required." }),
      order: z
        .number({ required_error: "Order is required." })
        .int()
        .positive(),
    })
    .array()
    .min(1, { message: "Enroll at least one grading period." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.title.toLowerCase())
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Grading period title already exists.",
          path: [errorPosition, "title"],
        })
      }
    }),
})

export type SchoolClassInputs = z.infer<typeof schoolClassSchema>
