'use client';

import { OrderLineItem } from '@prisma/client';
import { create } from 'zustand';

export interface LineItem extends Omit<OrderLineItem, 'id'> {
  attributes: Array<{ key: string; value: string }>;
}

const testData = [
  {
    productVariantId: 'cm4kles58000e66qh6ob8990m',
    productName: 'Strawberry Match',
    sku: 'STR-MAT-12O-COL',
    unitPrice: 169,
    qty: 7,
    attributes: [
      {
        key: 'Temp',
        value: 'Cold',
      },
      {
        key: 'Size',
        value: '12oz',
      },
    ],
  },
  {
    productVariantId: 'cm4k1sb2r000usg45fnqzj5mr',
    productName: 'Almond Latte',
    sku: 'ALM-LAT-22O-COL',
    unitPrice: 229,
    qty: 2,
    attributes: [
      {
        key: 'Temp',
        value: 'Cold',
      },
      {
        key: 'Size',
        value: '22oz',
      },
    ],
  },
  {
    productVariantId: 'cm4h4sulm0013unp2mwh3uhij',
    productName: 'Match Latte',
    sku: 'MAT-LAT-16OZ-COLD',
    unitPrice: 169,
    qty: 2,
    attributes: [
      {
        key: 'Temp',
        value: 'Cold',
      },
      {
        key: 'Size',
        value: '16oz',
      },
    ],
  },
];

interface UsePOSOrdersStoreState {
  lineItems: LineItem[];
  addLineItem: (line: LineItem) => void;
  increaseQty: (lineId: string) => void;
  decreaseQty: (lineId: string) => void;
  removeLineItem: (lineId: string) => void;
  updateLineItemQty: (lineId: string, qty: number) => void;
  resetLineItems: () => void;
}

export const usePOSOrdersStore = create<UsePOSOrdersStoreState>((set) => ({
  lineItems: testData,
  resetLineItems: () => set((state) => ({ ...state, lineItems: [] })),
  addLineItem: (line) =>
    set((state) => ({ ...state, lineItems: [...state.lineItems, line] })),
  removeLineItem: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.filter(
        (l) => l.productVariantId !== lineId
      );

      return {
        ...state,
        lineItems: updatedLineItems,
      };
    }),
  updateLineItemQty: (lineId, qty) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty + qty } : l
      );

      return {
        ...state,
        lineItems: updatedLineItems,
      };
    }),
  increaseQty: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty + 1 } : l
      );

      return {
        ...state,
        lineItems: updatedLineItems,
      };
    }),
  decreaseQty: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty - 1 } : l
      );

      return {
        ...state,
        lineItems: updatedLineItems,
      };
    }),
}));
