import { type Metadata } from "next"
import { TeacherForm } from "@/features/teachers/teacher-form"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Add Teacher",
}

function NewTeacherPage() {
  return (
    <>
      <AppHeader pageTitle="New Teacher" />
      <AppContent>
        <TeacherForm />
      </AppContent>
    </>
  )
}

export default NewTeacherPage
