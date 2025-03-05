/*
  Warnings:

  - You are about to drop the column `gradingPeriodId` on the `GradeComponent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GradeComponent" DROP CONSTRAINT "GradeComponent_gradingPeriodId_fkey";

-- DropIndex
DROP INDEX "GradeComponent_gradingPeriodId_idx";

-- AlterTable
ALTER TABLE "GradeComponent" DROP COLUMN "gradingPeriodId";

-- CreateTable
CREATE TABLE "_GradeComponentToGradingPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GradeComponentToGradingPeriod_AB_unique" ON "_GradeComponentToGradingPeriod"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeComponentToGradingPeriod_B_index" ON "_GradeComponentToGradingPeriod"("B");

-- AddForeignKey
ALTER TABLE "_GradeComponentToGradingPeriod" ADD CONSTRAINT "_GradeComponentToGradingPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "GradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeComponentToGradingPeriod" ADD CONSTRAINT "_GradeComponentToGradingPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "GradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
