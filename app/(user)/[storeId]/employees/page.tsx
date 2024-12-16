import { Metadata } from "next"
import { EmployeesTable } from "@/features/settings/employees-table"
import { UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Employees",
}

function EmployeesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Employees</h1>
          <p className="text-muted-foreground text-sm">
            View, create, and manage your employees. Store: {params.storeId}
          </p>
        </div>
        <div className="ml-auto">
          <Button size="sm">
            <UserPlusIcon />
            Add Employee
          </Button>
        </div>
      </div>
      <EmployeesTable />
    </div>
  )
}

export default EmployeesPage
