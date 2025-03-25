import { type Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/auth"
import { CertificateViewer } from "@/features/certificates/certificate-form"
import { InboxIcon, PlusIcon } from "lucide-react"

import prisma from "@/lib/db"
import { Button } from "@/components/ui/button"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"

export const metadata: Metadata = {
  title: "Certificates",
}

async function CertificatesPage() {
  const session = await getSession()

  const certificates = await prisma.certificateTemplate.findMany({
    where: { schoolId: session?.user.schoolId! },
    include: { school: { select: { name: true } } },
  })

  return (
    <>
      <AppHeader pageTitle="Certificates" />
      <AppContent>
        <div className="ml-auto">
          <Button asChild size="sm">
            <Link href="/certificates/new">
              <PlusIcon className="size-4" /> Create Template
            </Link>
          </Button>
        </div>
        {certificates.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No certificate templates to display. Create one now.
            </p>
            <Button asChild size="sm">
              <Link href="/certificates/new">
                <PlusIcon className="size-4" /> Create Template
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-6">
            {certificates.map((certificate) => {
              return (
                <li key={certificate.id} className="h-[500px]">
                  <div className="rounded-md border h-full flex flex-col items-center justify-center">
                    <p className="text-sm mb-2 font-medium">
                      {certificate.name}
                    </p>
                    <CertificateViewer
                      schoolName={certificate.school.name}
                      name="Student Name"
                      details={{
                        name: certificate.name,
                        frameSrc: certificate.frameSrc,
                        logo1: certificate.logo1,
                        logo2: certificate.logo2,
                        headingLine1: certificate.headingLine1,
                        headingLine2: certificate.headingLine2,
                        headingLine3: certificate.headingLine3,
                        headingLine4: certificate.headingLine4,
                        mainTitle: certificate.mainTitle,
                        bodyLine1: certificate.bodyLine1,
                        bodyLine2: certificate.bodyLine2,
                        bodyLine3: certificate.bodyLine3,
                        signatories: certificate.signatories as any,
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </AppContent>
    </>
  )
}

export default CertificatesPage
