/*
  Warnings:

  - You are about to drop the column `programOfferingId` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_programOfferingId_fkey";

-- DropIndex
DROP INDEX "Teacher_programOfferingId_idx";

-- DropIndex
DROP INDEX "Teacher_programOfferingId_teacherId_key";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "programOfferingId";

-- CreateTable
CREATE TABLE "_ProgramOfferingToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramOfferingToTeacher_AB_unique" ON "_ProgramOfferingToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramOfferingToTeacher_B_index" ON "_ProgramOfferingToTeacher"("B");

-- AddForeignKey
ALTER TABLE "_ProgramOfferingToTeacher" ADD CONSTRAINT "_ProgramOfferingToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramOfferingToTeacher" ADD CONSTRAINT "_ProgramOfferingToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
