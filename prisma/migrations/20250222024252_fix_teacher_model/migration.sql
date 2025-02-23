/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,teacherId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programOfferingId,teacherId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `programOfferingId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Teacher_schoolId_teacherId_idx";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "programOfferingId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Teacher_programOfferingId_idx" ON "Teacher"("programOfferingId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_schoolId_teacherId_key" ON "Teacher"("schoolId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_programOfferingId_teacherId_key" ON "Teacher"("programOfferingId", "teacherId");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
