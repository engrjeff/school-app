/*
  Warnings:

  - Added the required column `studentId` to the `SubjectGrade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGrade" ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SubjectGrade_studentId_idx" ON "SubjectGrade"("studentId");

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
