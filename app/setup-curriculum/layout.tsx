import * as React from "react"
import Link from "next/link"

import { site } from "@/config/site"
import { Button } from "@/components/ui/button"
import { CurriculumStepProgress } from "@/components/curriculum-step-progress"

const steps = [
  { name: "Program selection", href: "/setup-curriculum" },
  { name: "Setup Courses", href: "/setup-curriculum/courses" },
  { name: "Setup Subjects", href: "/setup-curriculum/subjects" },
]

function SetupCurriculumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container mx-auto grid max-w-7xl grid-cols-[200px_auto_200px] items-center justify-between p-4">
        <div>
          <span className="text-primary text-xl font-semibold">
            {site.title}
          </span>
        </div>
        <CurriculumStepProgress steps={steps} />
        <Button variant="ghost" asChild>
          <Link href="/dashboard">Skip to Dashboard</Link>
        </Button>
      </header>
      <main className="container mx-auto max-w-screen-sm py-10">
        {children}
      </main>
    </>
  )
}

export default SetupCurriculumLayout
