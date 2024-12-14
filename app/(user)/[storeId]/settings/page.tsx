import { TabsContent } from '@/components/ui/tabs';
import { DiscountsTable } from '@/features/settings/discounts-table';
import { GoalsForm } from '@/features/settings/goals-form';
import { SettingsTabs } from '@/features/settings/settings-tabs';
import { StoreSettingsForm } from '@/features/settings/store-settings-form';
import { getStoreById } from '@/features/store/queries';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Settings',
};

async function SettingsPage({ params }: { params: { storeId: string } }) {
  const store = await getStoreById(params.storeId);

  if (!store) return notFound();

  return (
    <div className="container max-w-5xl flex flex-col gap-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Store Settings for {store.name}</h1>
          <p className="text-sm text-muted-foreground">
            View and manage store settings, goals, and discounts.
          </p>
        </div>
      </div>
      <Suspense>
        <SettingsTabs>
          <TabsContent
            value="settings"
            className="p-4 mt-0 flex flex-col gap-2 flex-1 empty:hidden"
          >
            <StoreSettingsForm store={store} />
          </TabsContent>

          <TabsContent
            value="discounts"
            className="p-4 mt-0 flex flex-col gap-2 flex-1 empty:hidden"
          >
            <DiscountsTable storeId={params.storeId} />
          </TabsContent>
          <TabsContent
            value="goals"
            className="p-4 mt-0 flex flex-col gap-2 flex-1 empty:hidden"
          >
            <GoalsForm store={store} />
          </TabsContent>
        </SettingsTabs>
      </Suspense>
    </div>
  );
}

export default SettingsPage;
