'use client';

const formatDate = (dateString: number | string | Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'bg-green-400/20 text-green-400';
    case PaymentStatus.PENDING:
      return 'bg-yellow-400/20 text-yellow-400';
    case PaymentStatus.REFUNDED:
      return 'bg-red-400/20 text-red-400';
    default:
      return 'bg-gray-400/20 text-gray-400';
  }
};
const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.FULFILLED:
      return 'bg-green-400/20 text-green-400';
    case OrderStatus.PREPARING:
      return 'bg-yellow-400/20 text-yellow-400';
    case OrderStatus.READY_FOR_PICKUP:
      return 'bg-purple-400/20 text-purple-400';
    case OrderStatus.UNFULFILLED:
      return 'bg-red-400/20 text-red-400';
    default:
      return 'bg-gray-400/20 text-gray-400';
  }
};

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
import { formatCurrency } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ChevronDown, ChevronRight, MoreHorizontalIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
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
          <TableHead>Payment Status</TableHead>
          <TableHead>Order Status</TableHead>
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
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getPaymentStatusColor(order.paymentStatus)}
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getOrderStatusColor(order.orderStatus)}
                >
                  {order.orderStatus}
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
                  <div className="px-8 py-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Order Items</h4>
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
