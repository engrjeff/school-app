import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BanIcon, BanknoteIcon, WalletIcon } from 'lucide-react';

export function PaymentMethodRadio({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="pt-4">
      <p className="text-sm font-medium mb-2">Payment Method</p>
      <RadioGroup
        className="grid-cols-3"
        defaultValue="unpaid"
        value={value}
        onValueChange={onValueChange}
      >
        <label className="relative flex cursor-pointer flex-col bg-background/60 items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary/70">
          <RadioGroupItem
            id="radio-unpaid"
            value="unpaid"
            className="sr-only after:absolute after:inset-0"
          />
          <BanIcon size={20} aria-hidden="true" className="text-red-500" />
          <p className="text-xs font-medium leading-none text-foreground">
            Unpaid
          </p>
        </label>
        <label className="relative flex cursor-pointer flex-col bg-background/60 items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary/70">
          <RadioGroupItem
            id="radio-cash"
            value="cash"
            className="sr-only after:absolute after:inset-0"
          />
          <BanknoteIcon
            size={20}
            aria-hidden="true"
            className="text-green-500"
          />
          <p className="text-xs font-medium leading-none text-foreground">
            Cash
          </p>
        </label>
        <label className="relative flex cursor-pointer flex-col bg-background/60 items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary/70">
          <RadioGroupItem
            id="radio-gcash"
            value="gcash"
            className="sr-only after:absolute after:inset-0"
          />
          <WalletIcon size={20} aria-hidden="true" className="text-blue-500" />
          <p className="text-xs font-medium leading-none text-foreground">
            GCash
          </p>
        </label>
      </RadioGroup>
    </div>
  );
}
