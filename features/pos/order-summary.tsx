'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { NumberInput } from '@/components/ui/number-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SubmitButton } from '@/components/ui/submit-button';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { OrderStatus } from '@prisma/client';
import { format } from 'date-fns';
import { ArrowLeft, Minus, Plus, TrashIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import { createOrder } from '../order/actions';
import { orderStatuses } from '../order/helpers';
import { useStoreId } from '../store/hooks';
import { DiscountForm, DiscountValue } from './discount-form';
import { PaymentMethodRadio } from './payment-method-radio';
import { LineItem, usePOSOrdersStore } from './pos-order-store';

export function OrderSummary() {
  const storeId = useStoreId();

  const createAction = useAction(createOrder, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ?? 'The order was not created. Please try again.'
      );
    },
  });

  const orders = usePOSOrdersStore((state) => state.lineItems);
  const resetOrders = usePOSOrdersStore((state) => state.resetLineItems);

  const [view, setView] = useState<'orders' | 'payment' | 'details'>('orders');

  const [orderNumber, setOrderNumber] = useState(() => generateOrderNumber());

  const [shippingFee, setShippingFee] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0); // percent

  const [discount, setDiscount] = useState<DiscountValue>({
    discountAmount: 0,
    discountCode: '',
    id: '', // discountId
  });

  const [orderStatus, setOrderStatus] = useState<string>(OrderStatus.PREPARING);

  const [paymentMethod, setPaymentMethod] = useState('unpaid');

  const [customerName, setCustomerName] = useState('');

  const [orderDate, setOrderDate] = useState('');

  const subtotal = orders.reduce(
    (total, line) => total + line.unitPrice * line.qty,
    0
  );

  const shipping = isNaN(shippingFee) ? 0 : shippingFee;

  const serviceChargeDisplay = isNaN(serviceCharge)
    ? ''
    : `(${serviceCharge.toFixed(1) + '%'})`;

  const serviceChargeValue = isNaN(serviceCharge)
    ? 0
    : serviceCharge * 0.01 * subtotal;

  const total =
    subtotal + shipping + discount.discountAmount + serviceChargeValue;

  function resetAll() {
    resetOrders();
    setOrderStatus(OrderStatus.PREPARING);
    setPaymentMethod('unpaid');
    setCustomerName('');
    setOrderDate('');
    setShippingFee(0);
    setServiceCharge(0);
    setDiscount({ discountAmount: 0, discountCode: '', id: '' });

    createAction.reset();

    setView('orders');

    setOrderNumber(generateOrderNumber());
  }

  async function saveOrder() {
    const response = await createAction.executeAsync({
      storeId,
      orderId: orderNumber,
      paymentMethod,
      orderDate,
      regularAmount: subtotal,
      totalAmount: total,
      shippingFee: isNaN(shippingFee) ? 0 : shippingFee,
      serviceCharge: isNaN(serviceCharge) ? 0 : serviceCharge,
      customerName: customerName ?? undefined,
      discountId: discount.id ?? undefined,
      orderStatus: orderStatus as OrderStatus,
      paymentStatus: paymentMethod === 'unpaid' ? 'PENDING' : 'PAID',
      lineItems: orders,
    });

    if (response?.data?.order.id) {
      toast.success('Order saved!');

      resetAll();
    }
  }

  if (!orders.length)
    return (
      <aside className="bg-muted max-w-sm w-full shrink-0 border rounded-lg p-4 h-full items-center justify-center flex flex-col gap-4 max-h-full overflow-y-auto sticky top-0">
        <p className="text-center text-muted-foreground">No orders yet.</p>
      </aside>
    );

  return (
    <aside className="bg-muted max-w-sm w-full shrink-0 border rounded-lg p-4 h-full max-h-full overflow-y-auto sticky top-0">
      {view === 'orders' ? (
        <div className="h-full flex flex-col gap-4">
          <p>Order # {orderNumber}</p>
          <ScrollArea>
            <ul className="space-y-3 max-h-[400px]">
              {orders.map((line, lineIndex) => (
                <li key={`${line.productVariantId}-${lineIndex + 1}`}>
                  <OrderLineItem line={line} />
                </li>
              ))}
            </ul>
          </ScrollArea>

          <div className="p-4 bg-border/90 justify-between flex-1 flex flex-col gap-2 rounded-md mt-auto">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Subtotal</p>
              <NumberFlow
                value={subtotal}
                format={{ style: 'currency', currency: 'PHP' }}
                className="font-semibold font-mono text-right block"
              />
            </div>

            <div className="mt-6">
              <Button
                type="button"
                className="rounded-full w-full"
                onClick={() => setView('payment')}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {view === 'payment' ? (
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="back to orders"
              className="shrink-0"
              onClick={() => setView('orders')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </Button>
            <p>Order # {orderNumber}</p>
          </div>

          <fieldset
            disabled={createAction.isPending}
            className="p-4 justify-between flex-1 flex flex-col gap-2 rounded-md"
          >
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-mono text-right">{formatCurrency(subtotal)}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="shipping" className="border-b-0">
                  <AccordionTrigger className="py-2">
                    <div className="flex-1 mr-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-mono text-right">
                        {formatCurrency(shipping)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="py-1.5 px-1">
                    <NumberInput
                      currency="₱"
                      placeholder=""
                      value={shippingFee}
                      min={0}
                      className="bg-muted border-border"
                      onChange={(e) => {
                        setShippingFee(e.currentTarget.valueAsNumber);
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="discount" className="border-b-0">
                  <AccordionTrigger className="py-2">
                    <div className="flex-1 mr-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-mono text-right">
                        {formatCurrency(discount.discountAmount)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="py-2 px-1">
                    <DiscountForm
                      value={discount}
                      onValueChange={setDiscount}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="service-charge" className="border-b-0">
                  <AccordionTrigger className="py-2">
                    <div className="flex-1 mr-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Service Charge {serviceChargeDisplay}
                      </span>
                      <span className="font-mono text-right">
                        {formatCurrency(serviceChargeValue)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="py-1.5 px-1">
                    <NumberInput
                      value={serviceCharge}
                      min={0}
                      max={100}
                      className="bg-muted border-border"
                      onChange={(e) => {
                        const val = e.currentTarget.valueAsNumber;
                        if (val > 100 || val < 1) return;

                        setServiceCharge(val);
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex items-center justify-between text-sm"></div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="font-semibold">Total</p>
              <p className="font-semibold font-mono text-right">
                {formatCurrency(total)}
              </p>
            </div>

            <PaymentMethodRadio
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            />

            <div className="mt-auto">
              <Button
                type="button"
                className="rounded-full w-full"
                onClick={() => setView('details')}
              >
                Add Details
              </Button>
            </div>
          </fieldset>
        </div>
      ) : null}

      {view === 'details' ? (
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="back to orders"
              className="shrink-0"
              onClick={() => setView('payment')}
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </Button>
            <p>Order # {orderNumber}</p>
          </div>

          <fieldset
            disabled={createAction.isPending}
            className="p-4 flex-1 flex flex-col gap-2 rounded-md"
          >
            <div className="space-y-2">
              <Label htmlFor="customerName">
                Customer Name{' '}
                <span className="text-xs text-muted-foreground italic">
                  (Optional)
                </span>
              </Label>
              <Input
                id="customerName"
                name="customerName"
                placeholder="John Doe"
                className="bg-muted border-border"
                value={customerName}
                onChange={(e) => setCustomerName(e.currentTarget.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderDate">
                Order Date{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              </Label>
              <Input
                id="orderDate"
                name="orderDate"
                type="datetime-local"
                className="w-min bg-muted border-border"
                max={format(new Date(), 'yyyy-MM-dd') + 'T12:00'}
                value={orderDate}
                onChange={(e) => setOrderDate(e.currentTarget.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-status">Order Status</Label>
              <NativeSelect
                id="order-status"
                name="orderStatus"
                className="bg-muted border-border w-min"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.currentTarget.value)}
              >
                {orderStatuses.map((status) => (
                  <option key={status.status} value={status.status}>
                    {status.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </fieldset>

          <div className="mt-auto">
            <SubmitButton
              type="button"
              className="rounded-full w-full"
              loading={createAction.isPending}
              onClick={saveOrder}
              disabled={!orderDate}
            >
              Confirm Order
            </SubmitButton>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function OrderLineItem({ line }: { line: LineItem }) {
  const store = usePOSOrdersStore();

  return (
    <div className="text-sm flex items-center justify-between bg-border/90 py-2 px-2.5 rounded-md">
      <div>
        <p className="font-medium">
          {line.productName}{' '}
          <span className="text-xs text-muted-foreground">
            x<NumberFlow value={line.qty} />
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {line.attributes.map((attr) => attr.value).join(', ')}
        </p>
      </div>

      <div>
        <NumberFlow
          value={line.unitPrice * line.qty}
          format={{ style: 'currency', currency: 'PHP' }}
          className="font-mono text-right mb-1 block"
        />
        <div
          className="inline-flex items-center justify-end mt-auto select-none"
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
            className="size-7 bg-transparent border-neutral-700"
            onClick={() => {
              if (line.qty === 1) {
                store.removeLineItem(line.productVariantId);
                return;
              }

              store.decreaseQty(line.productVariantId);
            }}
            disabled={line.qty === 0}
          >
            {line.qty === 1 ? (
              <TrashIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-red-500"
              />
            ) : (
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </Button>
          <div
            className="flex items-center px-2.5 text-sm text-center font-medium tabular-nums"
            aria-live="polite"
          >
            <NumberFlow
              value={line.qty}
              className="text-center"
              aria-label={`Current quantity is ${line.qty}`}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7 bg-transparent border-neutral-700"
            aria-label="Increase quantity"
            onClick={() => store.increaseQty(line.productVariantId)}
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
