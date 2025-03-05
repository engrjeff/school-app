import { loginSchema } from "@/features/auth/schema"
import { AccessDenied } from "@auth/core/errors"
import bcrypt from "bcryptjs"
import { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import prisma from "./lib/db"

export default {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validation = loginSchema.safeParse(credentials)

        if (!validation.success) return null

        const { email, password } = validation.data

        const foundUser = await prisma.user.findUnique({
          where: { email },

          include: {
            school: true,
            teacherProfile: {
              select: { id: true },
            },
          },
        })

        if (!foundUser) throw new AccessDenied("Invalid credentials.")

        const passwordsMatch = await bcrypt.compare(
          password,
          foundUser.hashedPassword!
        )

        if (!passwordsMatch) throw new AccessDenied("Invalid credentials.")

        const {
          name,
          email: userEmail,
          id,
          image,
          role,
          school,
          teacherProfile,
        } = foundUser

        return {
          name,
          email: userEmail,
          id,
          image,
          role,
          schoolId: school?.id ? school.id : null,
          teacherProfileId: teacherProfile?.id,
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
        session.user.schoolId = token.schoolId
        session.user.teacherProfileId = token.teacherProfileId
      }
      return session
    },
  },
} satisfies NextAuthConfig
