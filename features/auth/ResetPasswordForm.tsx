"use client"

import { useRef } from "react"
import { resetPasswordAction } from "@/actions/auth"
import { ResetPasswordToken } from "@prisma/client"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"
import { FormError } from "@/components/shared/form-error"

export function ResetPasswordForm({ token }: { token: ResetPasswordToken }) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const action = useServerAction(resetPasswordAction, {
    onSuccess(args) {
      toast.success("Success! Your password has been reset.", {
        position: "top-center",
      })
    },
    onError(args) {
      toast.error(args.err.message)
    },
  })

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Set up a new password</h1>
      <p className="pb-5 text-sm text-muted-foreground">
        {"Your password must be different from your previous one."}
      </p>
      <form
        ref={formRef}
        onChange={action.reset}
        action={action.executeFormAction}
      >
        <fieldset
          disabled={action.isPending || !token}
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
              className="bg-muted/30"
              autoFocus
            />
            <FormError error={action.error?.fieldErrors?.newPassword?.at(0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="inline-block">
              Confirm new password
            </Label>
            <PasswordInput
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Enter your password again"
              className="bg-muted/30"
            />
            <FormError
              error={action.error?.fieldErrors?.confirmPassword?.at(0)}
            />
          </div>
          <div className="pt-6">
            <SubmitButton loading={action.isPending} className="w-full">
              Update password
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
