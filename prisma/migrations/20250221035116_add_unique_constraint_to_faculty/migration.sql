/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,programOfferingId,title]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Faculty_schoolId_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_schoolId_programOfferingId_title_key" ON "Faculty"("schoolId", "programOfferingId", "title");
