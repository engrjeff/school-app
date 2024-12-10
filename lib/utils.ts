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
