"use client"

import { CircleCheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function TeacherSignUpLinkCopy({ teacherId }: { teacherId: string }) {
  async function handleCopy() {
    if (navigator.clipboard) {
      if (!location) return

      await navigator.clipboard.writeText(
        `${window.location.origin}/sign-up/teacher?teacherId=${teacherId}`
      )

      toast("Sign up link copied!", {
        position: "top-right",
        icon: <CircleCheckIcon className="size-4 text-emerald-500" />,
      })
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondaryOutline"
      onClick={handleCopy}
    >
      <CopyIcon /> Copy Sign Up Link
    </Button>
  )
}
