'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ChevronDown, ChevronRight, MoreHorizontalIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from './helpers';
import { OrdersWithLineItems } from './queries';

export function OrdersTable({ orders }: { orders: OrdersWithLineItems }) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Table containerClass="border rounded-lg">
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead className="text-center">Payment Status</TableHead>
          <TableHead className="text-center">Order Status</TableHead>
          <TableHead className="text-right">Total Amount</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <Fragment key={`order-${order.id}`}>
            <TableRow
              className="cursor-pointer"
              onClick={() => toggleRow(order.id)}
            >
              <TableCell>
                {expandedRows.has(order.id) ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </TableCell>
              <TableCell className="font-medium">{order.orderId}</TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getPaymentStatusColor(order.paymentStatus)}
                >
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={getOrderStatusColor(order.orderStatus)}
                >
                  {getOrderStatusLabel(order.orderStatus)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.totalAmount)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Ok');
                  }}
                >
                  <MoreHorizontalIcon size={16} />
                </Button>
              </TableCell>
            </TableRow>
            {expandedRows.has(order.id) && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7}>
                  <div className="py-4 px-2">
                    <div className="mb-2 text-muted-foreground">
                      <p className="font-semibold">
                        Order Items ({order.lineItems.length})
                      </p>
                      <p>Customer: {order.customerName ?? '--'}</p>
                      <p>
                        Paid with{' '}
                        <span className="capitalize">
                          {order.paymentMethod}
                        </span>
                      </p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.lineItems.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {line.productName}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {line.attributes
                                    .map((a) => a.value)
                                    .join(', ')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {line.qty}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(line.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(line.qty * line.unitPrice)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow className="border-b-0 hover:bg-background">
                          <TableCell
                            colSpan={3}
                            className="text-muted-foreground text-right"
                          >
                            Subtotal
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(order.regularAmount)}
                          </TableCell>
                        </TableRow>
                        {order.shippingFee ? (
                          <TableRow className="border-b-0 hover:bg-background">
                            <TableCell
                              colSpan={3}
                              className="text-muted-foreground text-right"
                            >
                              Shipping Fee
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(order.shippingFee)}
                            </TableCell>
                          </TableRow>
                        ) : null}
                        {order.serviceCharge ? (
                          <TableRow className="border-b-0 hover:bg-background">
                            <TableCell
                              colSpan={3}
                              className="text-muted-foreground text-right"
                            >
                              Service Charge ({order.serviceCharge}%)
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(
                                (order.serviceCharge / 100) *
                                  order.regularAmount
                              )}
                            </TableCell>
                          </TableRow>
                        ) : null}
                        {order.discount ? (
                          <TableRow className="border-b-0 hover:bg-background">
                            <TableCell
                              colSpan={3}
                              className="text-muted-foreground text-right"
                            >
                              Discount{' '}
                              <span className="text-green-500 font-semibold">
                                ({order.discount.discountCode})
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-red-500">
                              -{formatCurrency(order.discount.discountAmount)}
                            </TableCell>
                          </TableRow>
                        ) : null}
                        <TableRow className="hover:bg-background">
                          <TableCell
                            colSpan={3}
                            className="text-right font-semibold border-t border-dashed"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-right border-t border-dashed">
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
