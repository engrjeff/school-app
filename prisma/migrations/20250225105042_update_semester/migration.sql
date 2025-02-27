/*
  Warnings:

  - Added the required column `semesterId` to the `GradingPeriod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolYearId` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradingPeriod" ADD COLUMN     "semesterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Semester" ADD COLUMN     "schoolYearId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "GradingPeriod_semesterId_idx" ON "GradingPeriod"("semesterId");

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingPeriod" ADD CONSTRAINT "GradingPeriod_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
