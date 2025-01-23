"use client"

import { useAction } from "next-safe-action/hooks"

import { SubmitButton } from "@/components/ui/submit-button"

import { logout } from "./action"

export function SignOutButton() {
  const action = useAction(logout)

  async function handleSignout() {
    await action.executeAsync()
  }

  return (
    <SubmitButton
      type="submit"
      onClick={handleSignout}
      loading={action.isPending}
    >
      Sign Out
    </SubmitButton>
  )
}
