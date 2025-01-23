import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { SignOutDialog } from "@/features/auth/SignOutDialog"
import { checkIfUserHasSchool } from "@/features/school/queries"
import { SchoolForm } from "@/features/school/school-form"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const metadata: Metadata = {
  title: "Setup School",
}

async function SetupSchoolPage() {
  const hasSchool = await checkIfUserHasSchool()

  if (hasSchool) redirect(DEFAULT_LOGIN_REDIRECT)

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="absolute inset-x-3 top-4 flex items-center justify-between lg:inset-x-4">
        <div className="w-min">
          <SignOutDialog />
        </div>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="container max-w-md space-y-2">
          <h1 className="text-center text-2xl font-semibold">
            Let us set up your school.
          </h1>
          <p className="text-muted-foreground text-center">
            Fill in the required details below.
          </p>

          <div className="py-6">
            <SchoolForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SetupSchoolPage
