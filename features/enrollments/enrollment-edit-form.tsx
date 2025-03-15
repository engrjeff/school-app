"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { SubmitButton } from "@/components/ui/submit-button"

export function EnrollmentEditForm({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  const router = useRouter()

  const form = useForm()

  const onError = () => {}

  const onSubmit = async () => {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="container max-w-screen-md py-2"
      >
        <div className="mb-4 flex items-start gap-4">
          <Button
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label="go back"
            onClick={router.back}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href="/enrollments">Discard</Link>
            </Button>
            <SubmitButton size="sm" loading={false}>
              Save Changes
            </SubmitButton>
          </div>
        </div>
      </form>
    </Form>
  )
}
