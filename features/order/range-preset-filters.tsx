'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { DateRangePreset } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

const presets: Array<{ label: string; value: DateRangePreset }> = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
  },
  {
    value: 'this_week',
    label: 'This week',
  },
  {
    value: 'last_week',
    label: 'Last week',
  },
  {
    value: 'this_month',
    label: 'This month',
  },
  {
    value: 'last_month',
    label: 'Last month',
  },
  {
    value: 'this_year',
    label: 'This year',
  },
  {
    value: 'last_year',
    label: 'Last year',
  },
];

export function RangePresetFilter() {
  const [open, setOpen] = useState(false);

  const [presetQuery, setPresetQuery] = useQueryState(
    'range',
    parseAsString.withDefault('today').withOptions({ shallow: false })
  );

  const [selected, setSelected] = useState<string>(presetQuery);

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-muted border-neutral-800"
          >
            <CalendarIcon size={16} strokeWidth={2} aria-hidden="true" /> Date
            Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-52" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">
              Date Range Presets
            </div>
            <div className="space-y-1">
              {presets.map((preset) => (
                <div
                  key={`date-range-preset-${preset.value}`}
                  className="flex items-center gap-2 hover:bg-muted py-1.5 rounded-md px-1.5 -ml-1.5"
                >
                  <Checkbox
                    id={`date-range-preset-${preset.value}`}
                    checked={selected === preset.value}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected(preset.value);
                      }
                    }}
                  />
                  <Label
                    htmlFor={`date-range-preset-${preset.value}`}
                    className="font-normal w-full cursor-pointer"
                  >
                    {preset.label}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="-mx-3 h-px bg-border"
              ></div>
              <div className="flex justify-between gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => {
                    setSelected('today');
                    setPresetQuery('today');
                    setOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setPresetQuery(selected);
                    setOpen(false);
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
