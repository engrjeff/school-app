import * as z from "zod"

export const schoolSchema = z.object({
  name: z.string().nonempty({ message: "School name is required." }),
  shortName: z.string().nonempty({ message: "School short name is required." }),
  schoolId: z.string().nonempty({ message: "School ID is required." }),
  address: z.string().nonempty({ message: "School address is required." }),
  region: z.string().nonempty({ message: "Region is required." }),
  province: z.string().nonempty({ message: "Province is required." }),
  town: z.string().nonempty({ message: "Town/City is required." }),
  zipCode: z.string().nonempty({ message: "Zip Codeis required." }),
  fullAddress: z.string().optional(),
  phone: z.string().nonempty({ message: "School phone number is required." }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email("Invalid email address."),
  website: z
    .union([
      z.literal(""),
      z.string().trim().url({ message: "Invalid website URL." }),
    ])
    .optional(),
  logo: z
    .union([
      z.literal(""),
      z.string().trim().url({ message: "Invalid logo URL." }),
    ])
    .optional(),
  slogan: z.string().optional(),
})

export type SchoolInputs = z.infer<typeof schoolSchema>
