'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { CalendarIcon } from 'lucide-react';

const ranges = [
  {
    value: 'this-week',
    label: 'This week',
  },
  {
    value: 'this-month',
    label: 'This month',
  },
  {
    value: 'this-year',
    label: 'This year',
  },
  {
    value: 'last-year',
    label: 'Last year',
  },
];

export function OrdersRangeFilter() {
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-muted border-neutral-800"
          >
            <CalendarIcon size={16} strokeWidth={2} aria-hidden="true" /> Select
            Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-52 border-neutral-800" align="end">
          <div className="space-y-3 p-3 bg-muted/90">
            <div className="text-xs font-medium text-muted-foreground">
              Select Range
            </div>
            <form className="space-y-1">
              {ranges.map((range) => (
                <div
                  key={`range-${range.value}`}
                  className="flex items-center gap-2 hover:bg-primary/20 py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox id={`range-${range.value}`} />
                  <Label
                    htmlFor={`range-${range.value}`}
                    className="font-normal w-full"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="-mx-3 my-1 h-px bg-border"
              ></div>
              <div className="flex justify-between gap-2">
                <Button size="sm" variant="outline" className="h-7 px-2">
                  Clear
                </Button>
                <Button size="sm" className="h-7 px-2">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
