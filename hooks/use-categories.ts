'use client';

import { apiClient } from '@/lib/api-client';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

async function getCategories() {
  const response = await apiClient.get<Category[]>('/categories');

  return response.data;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
