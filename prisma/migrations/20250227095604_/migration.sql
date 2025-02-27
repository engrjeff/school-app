/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,schoolYearId,semesterId,programOfferingId,courseId,gradeYearLevelId,sectionId,subjectId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Class_schoolId_schoolYearId_semesterId_programOfferingId_co_key" ON "Class"("schoolId", "schoolYearId", "semesterId", "programOfferingId", "courseId", "gradeYearLevelId", "sectionId", "subjectId");
