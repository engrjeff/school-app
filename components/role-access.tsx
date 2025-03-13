"use client"

import * as React from "react"
import { ROLE } from "@prisma/client"
import { useSession } from "next-auth/react"

export function RoleAccess({
  role,
  children,
  loadingUi,
  fallback,
}: React.PropsWithChildren<{
  role: ROLE
  loadingUi?: React.ReactNode
  fallback?: React.ReactNode
}>) {
  const session = useSession()

  if (session.status === "loading") return loadingUi ? loadingUi : null

  if (session.data?.user?.role !== role) return fallback ? fallback : null

  return <>{children}</>
}
