import { type Metadata } from "next"
import { SignUpForm } from "@/features/auth/SignUpForm"

export const metadata: Metadata = {
  title: "Sign Up",
}

function RegisterPage() {
  return <SignUpForm />
}

export default RegisterPage
