/*
  Warnings:

  - Made the column `schoolId` on table `Section` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_gradeYearLevelId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_schoolId_fkey";

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "schoolId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeYearLevelId_fkey" FOREIGN KEY ("gradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
