import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function EmployeesTable() {
  return (
    <>
      <Table containerClass="border rounded-lg flex-none">
        <TableHeader>
          <TableRow>
            <TableHead className="w-9 text-center">#</TableHead>
            <TableHead className="text-center">Employee Name</TableHead>
            <TableHead className="text-center">Is active?</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {['Employee 1', 'Employee 2', 'Employee 3', 'Employee 4'].map(
            (employee, n) => (
              <TableRow key={`employee-${employee}`}>
                <TableCell className="text-center">{n + 1}</TableCell>
                <TableCell className="text-center">{employee}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      id="employee-active"
                      className="data-[state=unchecked]:bg-border"
                    />
                    <Label htmlFor="employee-active" className="sr-only">
                      Is active?
                    </Label>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <Button size="sm" variant="link" className="text-blue-500">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </>
  );
}
