import Link from "next/link"
import { ArrowRight, BookCheck, Shield, UserCheck } from "lucide-react"

import { site } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function Home() {
  return (
    <div className="container mx-auto flex min-h-full max-w-screen-lg flex-col items-center justify-center px-6">
      <main>
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-primary">{site.title}</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Select user type to continue.
        </p>

        <div className="space-y-3">
          <Button size="xl" variant="outline" className="w-full" asChild>
            <Link href="/sign-in?role=admin">
              <Shield /> Admin
            </Link>
          </Button>
          <Button size="xl" variant="outline" className="w-full" asChild>
            <Link
              href="/sign-in?role=teacher"
              className="bg-accent/50 pointer-events-none cursor-not-allowed"
            >
              <UserCheck /> Teacher (WIP)
            </Link>
          </Button>
          <Button size="xl" variant="outline" className="w-full" asChild>
            <Link
              href="/sign-in?role=student"
              className="bg-accent/50 pointer-events-none cursor-not-allowed"
            >
              <BookCheck /> Student (WIP)
            </Link>
          </Button>
        </div>

        <Separator className="my-6" />

        <p className="text-muted-foreground mb-6">New here?</p>

        <Button size="xl" className="w-full" asChild>
          <Link href="/sign-up">
            Register as School Admin <ArrowRight />
          </Link>
        </Button>
      </main>
    </div>
  )
}
