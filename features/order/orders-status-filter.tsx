'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { CircleDashedIcon } from 'lucide-react';
import { orderStatuses } from './helpers';

export function OrderStatusFilter() {
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Filters">
            <CircleDashedIcon size={16} strokeWidth={2} aria-hidden="true" />{' '}
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-52" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Order Status
            </div>
            <form className="space-y-1">
              {orderStatuses.map((status) => (
                <div
                  key={`order-status-${status.status}`}
                  className="flex items-center gap-2 hover:bg-accent py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox id={`order-status-${status.status}`} />
                  <Label
                    htmlFor={`order-status-${status.status}`}
                    className="font-normal"
                  >
                    {status.label}
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
