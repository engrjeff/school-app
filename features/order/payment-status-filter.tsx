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
import { paymentStatuses } from './helpers';

export function PaymentStatusFilter() {
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Filters">
            <CircleDashedIcon size={16} strokeWidth={2} aria-hidden="true" />{' '}
            Payment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-52" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Payment Status
            </div>
            <form className="space-y-1">
              {paymentStatuses.map((status) => (
                <div
                  key={`payment-status-${status.status}`}
                  className="flex items-center gap-2 hover:bg-accent py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox id={`payment-status-${status.status}`} />
                  <Label
                    htmlFor={`payment-status-${status.status}`}
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
