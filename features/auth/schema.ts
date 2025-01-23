import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, { message: "Email is required." })
    .email({ message: "Enter a valid email." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Must be a minimum of 8 characters." }),
})

export const sendResetPasswordInstructionSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .min(1, { message: "Email is required." }),
})

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required." })
      .min(1, { message: "Email is required." })
      .email({ message: "Enter a valid email." }),
    newPassword: z
      .string({ required_error: "New password is required." })
      .min(8, { message: "Must be a minimum of 8 characters." }),
    confirmPassword: z
      .string({ required_error: "Confirm your password" })
      .min(8, { message: "Must be a minimum of 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Your passwords don't match",
    path: ["confirmPassword"],
  })

export type LoginFormInput = z.infer<typeof loginSchema>

export type RegisterFormInput = z.infer<typeof registerSchema>
