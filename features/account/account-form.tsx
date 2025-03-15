"use client"

import { useRouter } from "next/navigation"
import { Teacher, User } from "@prisma/client"
import { ArrowLeftIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { site } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function AccountForm({
  userAccount,
}: {
  userAccount: Pick<User, "id" | "name" | "email" | "role"> & {
    teacherProfile: Teacher | null
  }
}) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      id: userAccount.id,
      email: userAccount.email,
      name: userAccount.name,
      role: userAccount.role,
    },
  })

  const onError = () => {}

  const onSubmit = async () => {}

  return (
    <Form {...form}>
      <div className="flex items-start gap-4">
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
          <h2 className="text-lg font-bold tracking-tight">My Account</h2>
          <p className="text-muted-foreground text-sm">
            View and make changes to your {site.title} account.
          </p>
        </div>
      </div>
      <Separator className="my-2" />
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed"
          disabled={false}
        >
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Account Details
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input readOnly placeholder="Account name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input readOnly placeholder="Role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  )
}
