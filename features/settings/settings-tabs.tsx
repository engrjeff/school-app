'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseAsString, useQueryState } from 'nuqs';
import { type ReactNode } from 'react';

export function SettingsTabs({ children }: { children: ReactNode }) {
  const [tabQuery, setTabQuery] = useQueryState(
    'tab',
    parseAsString.withDefault('settings')
  );

  return (
    <Tabs
      defaultValue={tabQuery}
      onValueChange={setTabQuery}
      className="h-full w-full flex flex-col"
    >
      <TabsList className="h-auto w-full gap-2 max-w-full py-2 justify-start overflow-x-auto overflow-y-hidden rounded-none border-b border-neutral-800 bg-transparent px-2">
        <TabsTrigger
          value="settings"
          className="border-transparent py-1.5 px-2 hover:bg-neutral-800 data-[state=active]:bg-neutral-800 rounded-md data-[state=active]:border-foreground"
        >
          Settings
        </TabsTrigger>
        <TabsTrigger
          value="discounts"
          className="border-transparent py-1.5 px-2 hover:bg-neutral-800 data-[state=active]:bg-neutral-800 rounded-md data-[state=active]:border-foreground"
        >
          Discounts
        </TabsTrigger>
        <TabsTrigger
          value="goals"
          className="border-transparent py-1.5 px-2 hover:bg-neutral-800 data-[state=active]:bg-neutral-800 rounded-md data-[state=active]:border-foreground"
        >
          Goals
        </TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
}
