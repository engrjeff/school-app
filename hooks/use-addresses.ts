"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getBarangaysByCity,
  getCitiesByProvince,
  getProvincesByRegion,
  getRegions,
} from "@/lib/address"

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: getRegions,
  })
}

export function useProvinces(regionCode: string) {
  return useQuery({
    queryKey: ["provinces", regionCode],
    queryFn: () => getProvincesByRegion(regionCode),
    enabled: Boolean(regionCode),
  })
}

export function useCities(provinceCode: string) {
  return useQuery({
    queryKey: ["cities", provinceCode],
    queryFn: () => getCitiesByProvince(provinceCode),
    enabled: Boolean(provinceCode),
  })
}

export function useBarangays(cityCode: string) {
  return useQuery({
    queryKey: ["barangays", cityCode],
    queryFn: () => getBarangaysByCity(cityCode),
    enabled: Boolean(cityCode),
  })
}
