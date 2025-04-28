import { type Metadata } from "next"
import { LoginForm } from "@/features/auth/LoginForm"
import StudentEntryForm from "@/features/auth/StudentEntryForm"

export const metadata: Metadata = {
  title: "Sign In",
}

function SignInPage({ searchParams }: { searchParams: { role?: string } }) {
  if (searchParams?.role === "student") return <StudentEntryForm />

  return <LoginForm role={searchParams?.role} />
}

export default SignInPage
