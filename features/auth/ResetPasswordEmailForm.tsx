"use client"

import { useRef } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"

export function ResetPasswordEmailForm({ email }: { email?: string }) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const emailFieldRef = useRef<HTMLInputElement | null>(null)

  // const action = useServerAction(sendPasswordResetInstructionAction, {
  //   onSuccess(args) {
  //     toast.success("Check your email for password reset instructions.", {
  //       position: "top-center",
  //     })
  //   },
  //   onError({ err }) {
  //     if (err.code !== "INPUT_PARSE_ERROR") {
  //       toast.error(err.message, {
  //         position: "top-center",
  //       })

  //       emailFieldRef.current?.focus()
  //       return
  //     }
  //   },
  // })

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Reset password</h1>
      <p className="text-muted-foreground pb-5 text-sm">
        {
          "Include the email address associated with your account and we’ll send you an email with instructions to reset your password."
        }
      </p>
      <form ref={formRef}>
        <fieldset>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="youremail@example.com"
              name="email"
              id="email"
              className="bg-muted/30 h-12"
              autoFocus
              defaultValue={email}
              ref={emailFieldRef}
            />
          </div>
          <div className="pt-6">
            <SubmitButton loading={false} size="lg" className="w-full">
              Send reset instructions
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
