/*
  Warnings:

  - Added the required column `gradingPeriodId` to the `SubjectGradeSubComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGradeSubComponent" ADD COLUMN     "gradingPeriodId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponent_gradingPeriodId_idx" ON "SubjectGradeSubComponent"("gradingPeriodId");

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponent" ADD CONSTRAINT "SubjectGradeSubComponent_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "EnrollmentGradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
