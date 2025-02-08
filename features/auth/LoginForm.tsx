"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { site } from "@/config/site"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { loginAdmin } from "./action"
import { LoginFormInput, loginSchema } from "./schema"

export function LoginForm() {
  const form = useForm<LoginFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  const action = useAction(loginAdmin, {
    onError: (e) => {
      toast.error(e.error.serverError ?? "An unknown error occurred.")
    },
    onSuccess() {
      toast.success("Welcome!")
    },
  })

  const onError: SubmitErrorHandler<LoginFormInput> = (errors) => {
    console.error("Login Admin Errors: ", errors)
  }

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    await action.executeAsync(data)
  }

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Login to {site.title}</h1>
      <p className="text-muted-foreground pb-5 text-sm">
        {"Dont't have an account? "}
        <Link
          href="/sign-up"
          className="font-medium text-blue-500 hover:underline"
        >
          Sign Up
        </Link>
        .
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset className="space-y-2" disabled={action.isPending}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      type="email"
                      placeholder="youremail@example.com"
                      id="email"
                      className="dark:bg-muted/30 h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
                      className="dark:bg-muted/30 h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Link
                href={
                  form.getValues("email")
                    ? `/reset-password?email=${encodeURIComponent(form.getValues("email"))}`
                    : "/reset-password"
                }
                className="ml-auto inline-block text-sm font-medium text-blue-500 hover:underline"
                tabIndex={-1}
              >
                Forgot your password?
              </Link>
            </div>
            <div className="pt-6">
              <SubmitButton
                size="lg"
                loading={action.isPending}
                className="w-full"
              >
                Sign In
              </SubmitButton>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
