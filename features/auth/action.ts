"use server"

import { signIn, signOut } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT, SCHOOL_SETUP_REDIRECT } from "@/routes"
import { ROLE } from "@prisma/client"
import bcrypt from "bcryptjs"

import prisma from "@/lib/db"
import { actionClient } from "@/lib/safe-action"

import { loginSchema, registerSchema, teacherSignUpSchema } from "./schema"

export const loginAdmin = actionClient
  .metadata({ actionName: "loginAdmin" })
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    await signIn("credentials", {
      email: parsedInput.email,
      password: parsedInput.password,
      redirectTo: SCHOOL_SETUP_REDIRECT,
    })
  })

export const registerSchoolAdmin = actionClient
  .metadata({ actionName: "registerSchoolAdmin" })
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedInput.email,
      },
    })

    if (existingUser) {
      throw new Error("The email is already in use.")
    }

    const hashedPassword = await bcrypt.hash(parsedInput.password, 10)

    // create the school admin
    const schoolAdmin = await prisma.user.create({
      data: {
        role: ROLE.SCHOOLADMIN,
        name: parsedInput.name,
        email: parsedInput.email,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    await signIn("credentials", {
      email: parsedInput.email,
      password: parsedInput.password,
      redirectTo: SCHOOL_SETUP_REDIRECT,
    })

    return {
      data: schoolAdmin,
    }
  })

export const logout = actionClient
  .metadata({ actionName: "logout" })
  .action(async () => {
    await signOut({ redirectTo: "/sign-in" })
  })

// teacher sign up
export const registerSchoolTeacher = actionClient
  .metadata({ actionName: "registerSchoolTeacher" })
  .schema(teacherSignUpSchema)
  .action(async ({ parsedInput }) => {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedInput.email,
      },
    })

    if (existingUser) {
      throw new Error("The email is already in use.")
    }

    const hashedPassword = await bcrypt.hash(parsedInput.password, 10)

    // create the school teacher as a User
    const teacherUser = await prisma.user.create({
      data: {
        role: ROLE.TEACHER,
        name: parsedInput.name,
        email: parsedInput.email,
        hashedPassword,
        teacherProfile: {
          connect: {
            id: parsedInput.teacherId,
          },
        },
        school: {
          connect: {
            id: parsedInput.schoolId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    await signIn("credentials", {
      email: parsedInput.email,
      password: parsedInput.password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    return {
      data: teacherUser,
    }
  })
