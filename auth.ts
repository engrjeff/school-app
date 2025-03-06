import { cache } from "react"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import type { Adapter } from "next-auth/adapters"

import prisma from "./lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
        include: {
          school: true,
          teacherProfile: {
            select: { id: true },
          },
        },
      })

      if (dbUser) {
        token.id = dbUser.id
        token.role = dbUser.role
        token.schoolId = dbUser.schoolId
        token.teacherProfileId = dbUser.teacherProfile?.id
      }
      return token
    },
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
})

export const getSession = cache(auth)
