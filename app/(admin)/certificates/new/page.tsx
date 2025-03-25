import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { CertificateForm } from "@/features/certificates/certificate-form"
import { getSchoolOfUser } from "@/features/school/queries"

import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Create Certificate Template",
}

async function CreateCertificateTemplatePage() {
  const { school } = await getSchoolOfUser()

  if (!school) return notFound()

  return (
    <>
      <AppHeader pageTitle="Create Certificate Template" />
      <AppContent>
        <CertificateForm school={school} />
      </AppContent>
    </>
  )
}

export default CreateCertificateTemplatePage
