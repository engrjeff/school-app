/*
  Warnings:

  - You are about to drop the column `title` on the `Section` table. All the data in the column will be lost.
  - Added the required column `name` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Made the column `gradeYearLevelId` on table `Section` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_gradeYearLevelId_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "gradeYearLevelId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeYearLevelId_fkey" FOREIGN KEY ("gradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
