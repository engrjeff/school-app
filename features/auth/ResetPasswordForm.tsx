"use client"

import { useRef } from "react"
import { ResetPasswordToken } from "@prisma/client"

import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"

export function ResetPasswordForm({ token }: { token: ResetPasswordToken }) {
  const formRef = useRef<HTMLFormElement | null>(null)

  // const action = useServerAction(resetPasswordAction, {
  //   onSuccess(args) {
  //     toast.success("Success! Your password has been reset.", {
  //       position: "top-center",
  //     })
  //   },
  //   onError(args) {
  //     toast.error(args.err.message)
  //   },
  // })

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Set up a new password</h1>
      <p className="text-muted-foreground pb-5 text-sm">
        {"Your password must be different from your previous one."}
      </p>
      <form ref={formRef}>
        <fieldset
          disabled={false}
          className="space-y-4 disabled:cursor-not-allowed"
        >
          <input
            type="email"
            name="email"
            hidden
            className="sr-only"
            defaultValue={token?.email}
          />
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="inline-block">
              New password
            </Label>
            <PasswordInput
              name="newPassword"
              id="newPassword"
              placeholder="Enter your password"
              className="bg-muted/30 h-12"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="inline-block">
              Confirm new password
            </Label>
            <PasswordInput
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Enter your password again"
              className="bg-muted/30 h-12"
            />
          </div>
          <div className="pt-6">
            <SubmitButton size="lg" loading={false} className="w-full">
              Update password
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
