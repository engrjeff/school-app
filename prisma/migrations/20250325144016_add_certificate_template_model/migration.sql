-- CreateTable
CREATE TABLE "CertificateTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "frameSrc" TEXT NOT NULL,
    "logo1" TEXT NOT NULL,
    "logo2" TEXT NOT NULL,
    "headingLine1" TEXT NOT NULL,
    "headingLine2" TEXT NOT NULL,
    "headingLine3" TEXT NOT NULL,
    "headingLine4" TEXT NOT NULL,
    "mainTitle" TEXT NOT NULL,
    "bodyLine1" TEXT NOT NULL,
    "bodyLine2" TEXT NOT NULL,
    "bodyLine3" TEXT NOT NULL,
    "signatories" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CertificateTemplate_schoolId_idx" ON "CertificateTemplate"("schoolId");

-- CreateIndex
CREATE INDEX "CertificateTemplate_createdById_idx" ON "CertificateTemplate"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateTemplate_schoolId_name_key" ON "CertificateTemplate"("schoolId", "name");

-- AddForeignKey
ALTER TABLE "CertificateTemplate" ADD CONSTRAINT "CertificateTemplate_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateTemplate" ADD CONSTRAINT "CertificateTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
