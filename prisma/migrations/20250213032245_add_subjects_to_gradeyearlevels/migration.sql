-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "gradeYearLevelId" TEXT;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeYearLevelId_fkey" FOREIGN KEY ("gradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
