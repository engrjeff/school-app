/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,schoolYearId,semesterId,programOfferingId,courseId,gradeYearLevelId,sectionId]` on the table `EnrollmentClass` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schoolId` to the `EnrollmentClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnrollmentClass" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "EnrollmentClass_schoolId_idx" ON "EnrollmentClass"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "EnrollmentClass_schoolId_schoolYearId_semesterId_programOff_key" ON "EnrollmentClass"("schoolId", "schoolYearId", "semesterId", "programOfferingId", "courseId", "gradeYearLevelId", "sectionId");

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
