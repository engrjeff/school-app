/*
  Warnings:

  - You are about to drop the column `semesterId` on the `GradingPeriod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GradingPeriod" DROP CONSTRAINT "GradingPeriod_semesterId_fkey";

-- DropIndex
DROP INDEX "GradingPeriod_semesterId_idx";

-- AlterTable
ALTER TABLE "GradingPeriod" DROP COLUMN "semesterId";
