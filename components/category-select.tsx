'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories } from '@/hooks/use-categories';
import { cn } from '@/lib/utils';

interface CategoriesSelectProps {
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
}

export function CategorySelect({
  selectedCategoryId,
  onChange,
}: CategoriesSelectProps) {
  const [open, setOpen] = React.useState(false);

  const categoriesData = useCategories();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={categoriesData.isLoading}
          aria-expanded={open}
          className="border-border bg-muted w-full justify-between"
        >
          {selectedCategoryId
            ? categoriesData?.data?.find(
                (category) => category.id === selectedCategoryId
              )?.name
            : 'Select category'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-popover-trigger-width p-0">
        <Command
          filter={(value, search) => {
            if (
              categoriesData?.data
                ?.find((i) => i.id === value)
                ?.name.toLowerCase()
                .includes(search.toLowerCase())
            )
              return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search category" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoriesData.data?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    onChange(
                      currentValue === selectedCategoryId ? '' : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      selectedCategoryId === category.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
