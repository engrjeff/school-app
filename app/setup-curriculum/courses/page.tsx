import { redirect } from "next/navigation"
import { ProgramCoursesSelection } from "@/features/programs/program-courses-selection"
import { getSchoolOfUser } from "@/features/school/queries"

async function SetupCoursesPage() {
  const { school } = await getSchoolOfUser()

  if (school?.programOfferings.find((p) => p.code === "SHS")?._count.courses) {
    return redirect("/program-offerings")
  }

  return (
    <>
      <h1 className="mb-4   text-lg font-semibold">
        Add Senior High School Strands
      </h1>
      <p className="mb-4 text-sm">
        Since you have chosen Senior High School, you may select the tracks
        which your school is offering.
      </p>
      <ProgramCoursesSelection />
    </>
  )
}

export default SetupCoursesPage
