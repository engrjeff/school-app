import { Skeleton } from '@/components/ui/skeleton';

export function POSSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex w-max items-center gap-3">
        <Skeleton className="h-8 rounded-full border w-16 bg-background" />
        <Skeleton className="h-8 rounded-full border w-16 bg-background" />
        <Skeleton className="h-8 rounded-full border w-16 bg-background" />
      </div>

      <div className="flex items-start">
        <div className="h-[85vh] flex-1 pr-4 rounded-lg overflow-hidden">
          <div className="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]">
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <Skeleton
                key={v}
                className="w-full aspect-square bg-background"
              />
            ))}
          </div>
        </div>

        <Skeleton className="bg-background max-w-sm w-full shrink-0 rounded-lg h-full sticky top-0" />
      </div>
    </div>
  );
}
