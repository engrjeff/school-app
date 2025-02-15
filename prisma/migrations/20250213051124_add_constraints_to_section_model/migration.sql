/*
  Warnings:

  - A unique constraint covering the columns `[name,gradeYearLevelId]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Section_gradeYearLevelId_idx" ON "Section"("gradeYearLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_name_gradeYearLevelId_key" ON "Section"("name", "gradeYearLevelId");
