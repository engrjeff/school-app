import { type Metadata } from "next"
import { GradeComponentCard } from "@/features/grading/grade-component-card"
import { GradeComponentFormDialog } from "@/features/grading/grade-component-form"
import { getGradingComponents } from "@/features/grading/queries"
import { InboxIcon } from "lucide-react"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Grading Settings",
}

async function GradingDefinitionsPage() {
  const { gradingComponents } = await getGradingComponents()

  return (
    <>
      <AppHeader pageTitle="Grading Settings" />
      <AppContent>
        <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-medium">
              View, define, and manage grade components.
            </h2>
            <p className="text-muted-foreground text-sm">
              A student&apos;s grade is composed of many components. As a
              teacher, you may define the grade components here.
            </p>
          </div>
          <GradeComponentFormDialog />
        </div>
        {gradingComponents.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No grade components yet. Create one now.
            </p>
            <GradeComponentFormDialog />
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gradingComponents.map((gc) => (
              <li key={gc.id}>
                <GradeComponentCard gradeComponent={gc} />
              </li>
            ))}
          </ul>
        )}
      </AppContent>
    </>
  )
}

export default GradingDefinitionsPage
