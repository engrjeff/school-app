/*
  Warnings:

  - Added the required column `gradingPeriodId` to the `SubjectGradeSubComponentScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGradeSubComponentScore" ADD COLUMN     "gradingPeriodId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponentScore_gradingPeriodId_idx" ON "SubjectGradeSubComponentScore"("gradingPeriodId");

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" ADD CONSTRAINT "SubjectGradeSubComponentScore_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "EnrollmentGradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
