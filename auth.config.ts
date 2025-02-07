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
          },
        })

        if (!foundUser) throw new AccessDenied("Invalid credentials.")

        const passwordsMatch = await bcrypt.compare(
          password,
          foundUser.hashedPassword!
        )

        if (!passwordsMatch) throw new AccessDenied("Invalid credentials.")

        const { name, email: userEmail, id, image, role, school } = foundUser

        return {
          name,
          email: userEmail,
          id,
          image,
          role,
          schoolId: school?.id ? school.id : null,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
