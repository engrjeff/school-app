/*
  Warnings:

  - You are about to drop the column `name` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "suffix" TEXT;

-- CreateIndex
CREATE INDEX "Teacher_schoolId_teacherId_idx" ON "Teacher"("schoolId", "teacherId");

-- CreateIndex
CREATE INDEX "Teacher_userId_idx" ON "Teacher"("userId");
