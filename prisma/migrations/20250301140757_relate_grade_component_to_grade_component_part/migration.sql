/*
  Warnings:

  - You are about to drop the `_GradeComponentToGradeComponentPart` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gradeComponentId` to the `GradeComponentPart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GradeComponentToGradeComponentPart" DROP CONSTRAINT "_GradeComponentToGradeComponentPart_A_fkey";

-- DropForeignKey
ALTER TABLE "_GradeComponentToGradeComponentPart" DROP CONSTRAINT "_GradeComponentToGradeComponentPart_B_fkey";

-- AlterTable
ALTER TABLE "GradeComponentPart" ADD COLUMN     "gradeComponentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GradeComponentToGradeComponentPart";

-- AddForeignKey
ALTER TABLE "GradeComponentPart" ADD CONSTRAINT "GradeComponentPart_gradeComponentId_fkey" FOREIGN KEY ("gradeComponentId") REFERENCES "GradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
