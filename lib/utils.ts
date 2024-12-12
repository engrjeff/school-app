import { Category } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(inputStr: string) {
  return inputStr
    .split(' ')
    .map((s) => s.at(0))
    .join('');
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export function getPriceRange(prices: number[]) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) return formatCurrency(min);

  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export function getUniqueCategoriesFromProducts(categories: Category[]) {
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.id, c])).values()
  );

  return uniqueCategories;
}

export function generateOrderNumber() {
  return (
    new Date().toLocaleDateString().replaceAll('/', '') +
    Date.now().toString(36).toUpperCase()
  );
}
