"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface Step {
  name: string
  href: string
}

interface Props {
  steps: Step[]
}

export const CurriculumStepProgress = ({ steps }: Props) => {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) => pathname === step.href)

  return (
    <div aria-label="Onboarding progress">
      <ol className="mx-auto flex w-24 flex-nowrap gap-1 md:w-fit">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={cn(
              "h-1 w-12 rounded-full",
              index <= currentStepIndex
                ? "bg-primary"
                : "bg-gray-300 dark:bg-gray-700"
            )}
          >
            <span className="sr-only">
              {step.name}{" "}
              {index < currentStepIndex
                ? "completed"
                : index === currentStepIndex
                  ? "current"
                  : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
