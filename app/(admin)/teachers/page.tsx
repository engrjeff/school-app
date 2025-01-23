import { type Metadata } from "next"
import Link from "next/link"
import TeachersTable from "@/features/teachers/teachers-table"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metatdata: Metadata = {
  title: "Teachers",
}

function TeachersPage() {
  return (
    <>
      <AppHeader pageTitle="Teachers">
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link href="/teachers/new">
              Add Teacher <PlusIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </AppHeader>
      <AppContent>
        <TeachersTable />
      </AppContent>
    </>
  )
}

export default TeachersPage
