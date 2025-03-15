import { NextResponse } from "next/server"
import authConfig from "@/auth.config"
import {
  API_AUTH_PREFIX,
  API_ROUTES,
  AUTH_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
  ROLE_ROUTES_MAP,
  SCHOOL_SETUP_REDIRECT,
} from "@/routes"
import { ROLE } from "@prisma/client"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth

  const { nextUrl } = req

  if (nextUrl.pathname === "/") return NextResponse.next()

  if (nextUrl.pathname.startsWith("/school-directory"))
    return NextResponse.next()

  // if (PUBLIC_ROUTES.includes(nextUrl.pathname)) return NextResponse.next()

  if (nextUrl.pathname.startsWith("/verify")) return NextResponse.next()

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX)
  const isAuthPageRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  const isApiRoute = API_ROUTES.some((a) => nextUrl.pathname.startsWith(a))

  if (isApiAuthRoute || isApiRoute) return

  if (isAuthPageRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return
  }

  if (isLoggedIn) {
    const role = req.auth?.user.role
    const allowedRoutesForRole = ROLE_ROUTES_MAP[role!]

    if (!allowedRoutesForRole.some((r) => nextUrl.pathname.startsWith(r))) {
      return NextResponse.redirect(new URL(allowedRoutesForRole[0], nextUrl))
    }

    if (
      nextUrl.pathname !== SCHOOL_SETUP_REDIRECT &&
      !req.auth?.user.schoolId &&
      req.auth?.user.role === ROLE.SCHOOLADMIN
    )
      return NextResponse.redirect(new URL(SCHOOL_SETUP_REDIRECT, nextUrl))
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  return
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: ["**/node_modules/@react-email*/**/*.mjs*"],
}
