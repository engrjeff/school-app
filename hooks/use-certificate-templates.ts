"use client"

import { CertificateTemplate, School } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getCertificateTemplates() {
  const response =
    await apiClient.get<Array<CertificateTemplate & { school: School }>>(
      "/certificates"
    )
  return response.data
}

export function useCertificateTemplates() {
  return useQuery({
    queryKey: ["certificat-templates"],
    queryFn: getCertificateTemplates,
  })
}
