import { type Metadata } from "next"
import Link from "next/link"
import TeachersTable from "@/features/teachers/teachers-table"
import { ImportIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { SearchField } from "@/components/search-field"

export const metadata: Metadata = {
  title: "Teachers",
}

function TeachersPage() {
  return (
    <>
      <AppHeader pageTitle="Teachers" />
      <AppContent>
        <div className="flex items-center justify-between">
          <SearchField className="w-[300px]" />
          <div className="ml-auto space-x-3">
            <Button type="button" size="sm" variant="secondaryOutline">
              <ImportIcon /> Import
            </Button>
            <Button asChild size="sm">
              <Link href="/teachers/new">
                <PlusIcon className="size-4" /> Add Teacher
              </Link>
            </Button>
          </div>
        </div>
        <TeachersTable />
      </AppContent>
    </>
  )
}

export default TeachersPage
