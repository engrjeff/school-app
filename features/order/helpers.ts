import { OrderStatus, PaymentStatus } from '@prisma/client';

export const orderStatuses: Array<{ status: OrderStatus; label: string }> = [
  {
    status: OrderStatus.PREPARING,
    label: 'Preparing',
  },
  {
    status: OrderStatus.READY_FOR_PICKUP,
    label: 'Ready for Pick Up',
  },
  {
    status: OrderStatus.FULFILLED,
    label: 'Fulfilled',
  },
  {
    status: OrderStatus.UNFULFILLED,
    label: 'Unfulfilled',
  },
  {
    status: OrderStatus.CANCELLED,
    label: 'Cancelled',
  },
];

export const paymentStatuses: Array<{ status: PaymentStatus; label: string }> =
  [
    {
      status: PaymentStatus.PAID,
      label: 'Paid',
    },
    {
      status: PaymentStatus.PENDING,
      label: 'Pending',
    },
    {
      status: PaymentStatus.PARTIALLY_REFUNDED,
      label: 'Partially Refunded',
    },
    {
      status: PaymentStatus.REFUNDED,
      label: 'Refunded',
    },
  ];
