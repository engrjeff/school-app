/*
  Warnings:

  - You are about to drop the column `gradingPeriodId` on the `SubjectGradeSubComponentScore` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" DROP CONSTRAINT "SubjectGradeSubComponentScore_gradingPeriodId_fkey";

-- DropIndex
DROP INDEX "SubjectGradeSubComponentScore_gradingPeriodId_idx";

-- AlterTable
ALTER TABLE "SubjectGradeSubComponentScore" DROP COLUMN "gradingPeriodId";
