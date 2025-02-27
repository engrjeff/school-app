import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getSchoolOfUser } from "@/features/school/queries"
import { SCHOOL_SETUP_REDIRECT } from "@/routes"

import { AppSidebar } from "./app-sidebar"

export async function AppSidebarServer() {
  const { school } = await getSchoolOfUser()

  if (!school) redirect(SCHOOL_SETUP_REDIRECT)

  const session = await auth()

  return <AppSidebar session={session} school={school} />
}
