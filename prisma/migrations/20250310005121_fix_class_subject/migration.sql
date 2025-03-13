/*
  Warnings:

  - You are about to drop the column `studentId` on the `ClassSubject` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `ClassSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_studentId_fkey";

-- DropIndex
DROP INDEX "ClassSubject_studentId_idx";

-- AlterTable
ALTER TABLE "ClassSubject" DROP COLUMN "studentId",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ClassSubject_teacherId_idx" ON "ClassSubject"("teacherId");

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
