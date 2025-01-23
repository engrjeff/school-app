import { type Metadata } from "next"
import { LoginForm } from "@/features/auth/LoginForm"

export const metadata: Metadata = {
  title: "Sign In",
}

function SignInPage() {
  return <LoginForm />
}

export default SignInPage
