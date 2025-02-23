import { auth } from "@/auth"
import { ROLE } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { AuthError } from "next-auth"
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action"
import * as z from "zod"

class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message)

    if (e instanceof PrismaClientKnownRequestError) {
      if (
        e.message.includes(
          "Unique constraint failed on the fields: (`schoolId`,`studentId`)"
        )
      ) {
        return "Cannot have duplicate student ID or LRN."
      }

      if (
        e.message.includes(
          "Unique constraint failed on the fields: (`schoolId`,`teacherId`)"
        )
      ) {
        return "Cannot have duplicate teacher/employee ID."
      }
      if (
        e.message.includes(
          "Unique constraint failed on the fields: (`teacherId`)"
        )
      ) {
        return "Cannot have duplicate teacher/employee ID."
      }
    }

    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return "Invalid credentials"
        case "AccessDenied":
          return "Invalid credentials"
        default:
          return "Something went wrong"
      }
    }

    if (e instanceof ActionError) {
      return e.message
    }

    if (e instanceof Error) {
      return e.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    })
  },
  // Define logging middleware.
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await auth()

  if (!user?.user?.id) throw new Error("Session not found.")

  return next({ ctx: { user: user.user } })
})

export const adminActionClient = authActionClient.use(
  async ({ next, ctx: { user } }) => {
    if (user.role !== ROLE.SCHOOLADMIN) throw new Error("Unauthorized.")

    return next()
  }
)
