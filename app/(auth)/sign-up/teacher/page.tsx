import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { TeacherSignUpForm } from "@/features/auth/TeacherSignUpForm"
import { getTeacherById } from "@/features/teachers/queries"

export const metadata: Metadata = {
  title: "Teacher Sign Up",
}

interface PageProps {
  searchParams: { teacherId: string }
}

async function TeacherSignUpPage({ searchParams: { teacherId } }: PageProps) {
  const teacher = await getTeacherById(teacherId)

  if (!teacher) return notFound()

  return <TeacherSignUpForm teacher={teacher} />
}

export default TeacherSignUpPage
