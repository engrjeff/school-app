import { type Metadata } from "next"
import { StudentForm } from "@/features/students/student-form"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Add Student",
}

function NewStudentPage() {
  return (
    <>
      <AppHeader pageTitle="New Student" />
      <AppContent>
        <StudentForm />
      </AppContent>
    </>
  )
}

export default NewStudentPage
