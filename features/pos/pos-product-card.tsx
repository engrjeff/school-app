'use client';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import NumberFlow from '@number-flow/react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProductItem } from '@/hooks/use-products';
import { formatCurrency, getPriceRange } from '@/lib/utils';
import { ImageIcon, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePOSOrdersStore } from './pos-order-store';

export function POSProductCard({ product }: { product: ProductItem }) {
  const [qty, setQty] = useState(0);
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  const store = usePOSOrdersStore();

  // find variants
  const selectedVariant = product.variants.find((v) =>
    v.productAttributeValues.every((attr) =>
      Object.values(attributes).includes(attr.attributeValueId)
    )
  );

  function handleAddItem() {
    if (!selectedVariant || !qty) return;

    const existing = store.lineItems.find(
      (line) => line.productVariantId === selectedVariant.id
    );

    if (existing) {
      store.updateLineItemQty(selectedVariant.id, qty);

      // reset state
      setQty(0);
      setAttributes({});

      return;
    }

    store.addLineItem({
      productVariantId: selectedVariant?.id,
      productName: product.name,
      sku: selectedVariant.sku,
      unitPrice: selectedVariant.price,
      qty,
      attributes: selectedVariant.productAttributeValues.map((pv) => ({
        key: pv.attributeValue.attribute.name,
        value: pv.attributeValue.value,
      })),
    });

    // reset state
    setQty(0);
    setAttributes({});
  }

  return (
    <Card className="h-full flex flex-col bg-muted">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="size-11 relative rounded border bg-muted/30 text-muted-foreground flex items-center justify-center">
          <ImageIcon size={16} />
        </div>
        <div>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="text-green-500 font-medium text-[13px]">
            {selectedVariant
              ? formatCurrency(selectedVariant.price)
              : getPriceRange(product.variants.map((v) => v.price))}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1 select-none p-4 pt-0">
        <div className="space-y-3 flex-1">
          {product.attributes.map((attr) => (
            <fieldset key={`attr-${attr.id}`} className="space-y-4">
              <legend className="text-sm font-medium leading-none text-foreground">
                {attr.name}
              </legend>
              <RadioGroup
                className="grid grid-cols-4 gap-2"
                name={attr.name}
                value={attributes[attr.name as keyof typeof attributes] ?? ''}
                onValueChange={(val) =>
                  setAttributes((v) => ({ ...v, [attr.name]: val }))
                }
              >
                {attr.values.map((option) => (
                  <label
                    key={option.id}
                    className="relative flex cursor-pointer flex-col text-sm items-center gap-3 rounded-lg border px-1.5 py-2 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-disabled]]:cursor-not-allowed has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-[[data-disabled]]:opacity-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary/70"
                  >
                    <RadioGroupItem
                      id={option.id}
                      value={option.id}
                      className="sr-only after:absolute after:inset-0"
                    />
                    <p className="text-sm font-medium leading-none text-foreground">
                      {option.value}
                    </p>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
          ))}
        </div>

        <div className="select-none flex items-center justify-between mt-auto pt-4 gap-4">
          <div
            className="inline-flex items-center shrink-0"
            role="group"
            aria-labelledby="quality-control"
          >
            <span id="quality-control" className="sr-only">
              Quantity Control
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              className="border-border bg-background/60"
              onClick={() => setQty((q) => q - 1)}
              disabled={qty === 0}
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <div
              className="flex items-center px-3 text-center text-sm font-medium tabular-nums"
              aria-live="polite"
            >
              <NumberFlow
                value={qty}
                className="text-center"
                aria-label={`Current quantity is ${qty}`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              className="border-border bg-background/60"
              onClick={() => setQty((q) => q + 1)}
              disabled={
                product.attributes.length
                  ? product.attributes.length !== Object.keys(attributes).length
                  : false
              }
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={!selectedVariant || !qty}
            onClick={handleAddItem}
            className="flex-1"
          >
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
