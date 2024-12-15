import { ChartNoAxesColumn } from 'lucide-react';

export function EmptyView({ entity = 'data' }: { entity?: string }) {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-[300px]">
      <div className="flex text-muted-foreground">
        <ChartNoAxesColumn size={24} />
        <ChartNoAxesColumn size={24} className="-ml-1.5" />
      </div>
      <p className="text-base text-foreground text-center font-semibold">
        No {entity}
      </p>
      <p className="text-sm text-muted-foreground text-center">
        No {entity} here yet. New and existing data will be displayed here.
      </p>
    </div>
  );
}
