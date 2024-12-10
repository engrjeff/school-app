import { redirect } from 'next/navigation';

import { getStores } from '@/features/store/queries';
import { StoreForm } from '@/features/store/store-form';

export default async function Home() {
  const stores = await getStores();

  if (stores.length > 0) return redirect(`/${stores[0].id}/dashboard`);

  return (
    <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
      <StoreForm />
    </div>
  );
}
