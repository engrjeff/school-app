import * as z from "zod"

export const classSubjectSchema = z.object({
  teacherId: z
    .string({ required_error: "Teacher is required." })
    .nonempty({ message: "Teacher is required." }),
  subjectId: z
    .string({ required_error: "Subject is required." })
    .nonempty({ message: "Subject is required." }),
})

export const enrollmentSchema = z.object({
  schoolYearId: z
    .string({ required_error: "School Year is required." })
    .nonempty({ message: "School Year is required." }),
  semesterId: z
    .string({ required_error: "Semester Year is required." })
    .nonempty({ message: "Semester is required." }),
  programOfferingId: z
    .string({ required_error: "Program is required." })
    .nonempty({ message: "Program is required." }),
  courseId: z
    .string({ required_error: "Course is required." })
    .nonempty({ message: "Course is required." }),
  gradeYearLevelId: z
    .string({ required_error: "Grade/Year level is required." })
    .nonempty({ message: "Grade/Year level is required." }),
  sectionId: z
    .string({ required_error: "Section is required." })
    .nonempty({ message: "Section is required." }),
  subjects: classSubjectSchema
    .array()
    .min(1, { message: "Include at least 1 subject to this class." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => `${item.subjectId}-${item.teacherId}`)
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The subject-teacher combination is already added.",
          path: [errorPosition, "subjectId"],
        })
      }
    }),
})

export type EnrollmentInputs = z.infer<typeof enrollmentSchema>

export const classSubjectArraySchema = z.object({
  enrollmentClassId: z
    .string({ required_error: "Class is required." })
    .nonempty({ message: "Class is required." }),
  subjects: classSubjectSchema
    .array()
    .min(1, { message: "Include at least 1 subject to this class." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => `${item.subjectId}-${item.teacherId}`)
      ).size

      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The subject-teacher combination is already added.",
          path: [errorPosition, "subjectId"],
        })
      }
    }),
})

export type ClassSubjectsArrayInput = z.infer<typeof classSubjectArraySchema>

export const classStudentsSchema = z.object({
  enrollmentClassId: z
    .string({ required_error: "Class is required." })
    .nonempty({ message: "Class is required." }),
  studentIds: z
    .object({
      studentId: z
        .string({ required_error: "Student ID is required." })
        .nonempty({ message: "Student ID is required." }),
    })
    .array()
    .min(1, { message: "Enroll at least one student." }),
})

export type ClassStudentsInput = z.infer<typeof classStudentsSchema>
