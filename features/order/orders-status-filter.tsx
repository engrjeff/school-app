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
import { OrderStatus } from '@prisma/client';
import { CircleDashedIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { getOrderStatusLabel, orderStatuses } from './helpers';

export function OrderStatusFilter() {
  const [open, setOpen] = useState(false);

  const [statusQuery, setStatusQuery] = useQueryState(
    'order_status',
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
            Status{' '}
            {statusQuery ? (
              <Badge variant="filter">
                {getOrderStatusLabel(statusQuery as OrderStatus)}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-52" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Order Status
            </div>
            <div className="space-y-1">
              {orderStatuses.map((status) => (
                <div
                  key={`order-status-${status.status}`}
                  className="flex items-center gap-2 hover:bg-muted py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox
                    id={`order-status-${status.status}`}
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
                    htmlFor={`order-status-${status.status}`}
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
