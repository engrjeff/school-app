/*
  Warnings:

  - Added the required column `classSubjectId` to the `SubjectGradeSubComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGradeSubComponent" ADD COLUMN     "classSubjectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponent_classSubjectId_idx" ON "SubjectGradeSubComponent"("classSubjectId");

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponent" ADD CONSTRAINT "SubjectGradeSubComponent_classSubjectId_fkey" FOREIGN KEY ("classSubjectId") REFERENCES "ClassSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
