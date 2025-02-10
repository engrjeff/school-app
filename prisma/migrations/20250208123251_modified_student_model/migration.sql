/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,studentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_studentId_key";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'LISTED';

-- CreateIndex
CREATE UNIQUE INDEX "Student_schoolId_studentId_key" ON "Student"("schoolId", "studentId");
