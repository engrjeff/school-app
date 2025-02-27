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

import { registerSchoolAdmin } from "./action"
import { RegisterFormInput, registerSchema } from "./schema"

export function SignUpForm() {
  const form = useForm<RegisterFormInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  })

  const action = useAction(registerSchoolAdmin, {
    onError: (e) => {
      toast.error(e.error.serverError ?? "An unknown error occurred.")
    },
    onSuccess: () => {
      toast.success("Your account has been created successfully.")
    },
  })

  const onError: SubmitErrorHandler<RegisterFormInput> = (errors) => {
    console.error("Register Errors: ", errors)
  }

  const onSubmit: SubmitHandler<RegisterFormInput> = async (data) => {
    const result = await action.executeAsync(data)

    if (result?.data?.data) {
      toast.success(
        "Your account has been created successfully. Let's get your school set up."
      )

      window.location.href = "/setup-school"
    }
  }

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Create an {site.title} account</h1>
      <p className="text-muted-foreground pb-5 text-sm">
        {"Already have a School Admin account? "}
        <Link href="/" className="font-medium text-blue-500 hover:underline">
          Log in
        </Link>
        .
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset className="space-y-2" disabled={action.isPending}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Enter your name"
                      id="name"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
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
            <div className="pt-6">
              <SubmitButton
                size="lg"
                loading={action.isPending}
                className="w-full"
              >
                Create Account
              </SubmitButton>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  )
}
