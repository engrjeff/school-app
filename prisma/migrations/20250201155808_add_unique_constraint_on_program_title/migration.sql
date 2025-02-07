/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,title]` on the table `ProgramOffering` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProgramOffering_schoolId_title_key" ON "ProgramOffering"("schoolId", "title");
