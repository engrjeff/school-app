import { Button } from '@/components/ui/button';
import { EmployeesTable } from '@/features/settings/employees-table';
import { UserPlusIcon } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employees',
};

function EmployeesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container max-w-5xl flex flex-col gap-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground">
            View, create, and manage your employees.
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
  );
}

export default EmployeesPage;
