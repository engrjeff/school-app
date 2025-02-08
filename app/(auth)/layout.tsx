import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="absolute inset-x-3 top-4 flex items-center justify-between lg:inset-x-4">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
        >
          <ChevronLeft className="mr-3 size-4" /> Home
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center px-4">
        {children}
      </main>
    </div>
  )
}
