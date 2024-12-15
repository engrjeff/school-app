'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { usePageState } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentStatus } from '@prisma/client';
import { CircleDashedIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { getPaymentStatusLabel, paymentStatuses } from './helpers';

export function PaymentStatusFilter() {
  const [open, setOpen] = useState(false);

  const [statusQuery, setStatusQuery] = useQueryState(
    'payment_status',
    parseAsString.withDefault('').withOptions({ shallow: false })
  );

  const [selected, setSelected] = useState<string>(statusQuery);

  const [page, setPage] = usePageState();

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'bg-muted border-neutral-800',
              statusQuery ? 'pr-1' : ''
            )}
          >
            <CircleDashedIcon size={16} strokeWidth={2} aria-hidden="true" />{' '}
            Payment Status{' '}
            {statusQuery ? (
              <Badge variant="filter">
                {getPaymentStatusLabel(statusQuery as PaymentStatus)}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-52" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Payment Status
            </div>
            <div className="space-y-1">
              {paymentStatuses.map((status) => (
                <div
                  key={`payment-status-${status.status}`}
                  className="flex items-center gap-2 hover:bg-muted py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox
                    id={`payment-status-${status.status}`}
                    checked={selected === status.status}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected(status.status);
                      } else {
                        setSelected('');
                      }
                    }}
                  />
                  <Label
                    htmlFor={`payment-status-${status.status}`}
                    className="font-normal h-full w-full cursor-pointer"
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
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => {
                    setSelected('');
                    setStatusQuery('');
                    setOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setStatusQuery(selected);
                    setOpen(false);

                    if (page) {
                      setPage(null);
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
