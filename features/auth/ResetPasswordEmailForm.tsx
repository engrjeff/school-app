"use client"

import { useRef } from "react"
import { sendPasswordResetInstructionAction } from "@/actions/auth"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { FormError } from "@/components/shared/form-error"

export function ResetPasswordEmailForm({ email }: { email?: string }) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const emailFieldRef = useRef<HTMLInputElement | null>(null)

  const action = useServerAction(sendPasswordResetInstructionAction, {
    onSuccess(args) {
      toast.success("Check your email for password reset instructions.", {
        position: "top-center",
      })
    },
    onError({ err }) {
      if (err.code !== "INPUT_PARSE_ERROR") {
        toast.error(err.message, {
          position: "top-center",
        })

        emailFieldRef.current?.focus()
        return
      }
    },
  })

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <p className="pb-5 text-sm text-muted-foreground">
        {
          "Include the email address associated with your account and we’ll send you an email with instructions to reset your password."
        }
      </p>
      <form
        ref={formRef}
        onChange={action.reset}
        action={action.executeFormAction}
      >
        <fieldset>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="youremail@example.com"
              name="email"
              id="email"
              className="bg-muted/30"
              autoFocus
              defaultValue={email}
              ref={emailFieldRef}
            />
            <FormError error={action.error?.fieldErrors?.email?.at(0)} />
          </div>
          <div className="pt-6">
            <SubmitButton loading={action.isPending} className="w-full">
              Send reset instructions
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
