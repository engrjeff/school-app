import { type Metadata } from "next"
import { LoginForm } from "@/features/auth/LoginForm"

export const metadata: Metadata = {
  title: "Sign In",
}

function SignInPage({ searchParams }: { searchParams: { role?: string } }) {
  return <LoginForm role={searchParams?.role} />
}

export default SignInPage
