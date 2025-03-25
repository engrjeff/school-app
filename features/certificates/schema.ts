import * as z from "zod"

export const certificateSchema = z.object({
  name: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  frameSrc: z.string(),
  logo1: z.string(),
  logo2: z.string(),
  headingLine1: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  headingLine2: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  headingLine3: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  headingLine4: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  mainTitle: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  bodyLine1: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  bodyLine2: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  bodyLine3: z
    .string({ required_error: "Required." })
    .nonempty({ message: "Required." }),
  signatories: z
    .object({
      name: z
        .string({ required_error: "Required." })
        .nonempty({ message: "Required." }),
      designation: z
        .string({ required_error: "Required." })
        .nonempty({ message: "Required." }),
    })
    .array()
    .min(1, { message: "At least one signatory is required." }),
})

export type CertificateInputs = z.infer<typeof certificateSchema>
