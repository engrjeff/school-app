/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentClassId,teacherId,subjectId]` on the table `ClassSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClassSubject_enrollmentClassId_teacherId_subjectId_key" ON "ClassSubject"("enrollmentClassId", "teacherId", "subjectId");
