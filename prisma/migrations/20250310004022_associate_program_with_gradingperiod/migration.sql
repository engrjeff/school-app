/*
  Warnings:

  - Added the required column `programOfferingId` to the `EnrollmentGradingPeriod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnrollmentGradingPeriod" ADD COLUMN     "programOfferingId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "EnrollmentGradingPeriod_programOfferingId_idx" ON "EnrollmentGradingPeriod"("programOfferingId");

-- AddForeignKey
ALTER TABLE "EnrollmentGradingPeriod" ADD CONSTRAINT "EnrollmentGradingPeriod_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
