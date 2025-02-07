import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { ProgramSelectionForm } from "@/features/programs/program-selection-form"
import { getSchoolOfUser } from "@/features/school/queries"

export const metadata: Metadata = {
  title: "Set Up School Programs",
}

async function SetupSchoolPage() {
  const { school } = await getSchoolOfUser()

  if (school?.programOfferings?.length) return redirect("/dashboard")

  return (
    <>
      <h1 className="mb-4   text-lg font-semibold">
        What programs/educational levels are being offered in your school?
      </h1>
      <p className="mb-4 text-sm">
        You can choose multiple items at once. This will ease the creation of
        Program Offerings.
      </p>
      <ProgramSelectionForm />
    </>
  )
}

export default SetupSchoolPage
