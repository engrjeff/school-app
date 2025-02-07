import { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordEmailForm } from "@/features/auth/ResetPasswordEmailForm"
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm"

import { verifyResetPasswordToken } from "@/lib/server"
import { buttonVariants } from "@/components/ui/button"
import { StatusIcon } from "@/components/status-icon"

export const metadata: Metadata = {
  title: "Reset Password",
}

async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { email?: string; token?: string }
}) {
  if (searchParams.token) {
    const result = await verifyResetPasswordToken(searchParams.token)

    if (!result.token)
      return (
        <div className="flex flex-col items-center justify-normal space-y-3 p-4 py-20">
          <StatusIcon status="error" />
          <h1 className="text-xl font-bold">Ooops!</h1>
          <p>Invalid reset password token.</p>
          <Link href="/signin" className={buttonVariants()}>
            Go to Sign In Page
          </Link>
        </div>
      )

    return <ResetPasswordForm token={result.token} />
  }

  return <ResetPasswordEmailForm email={searchParams.email} />
}

export default ResetPasswordPage
