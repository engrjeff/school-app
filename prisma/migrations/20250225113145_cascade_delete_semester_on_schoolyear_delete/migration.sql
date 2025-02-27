-- DropForeignKey
ALTER TABLE "Semester" DROP CONSTRAINT "Semester_schoolYearId_fkey";

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
