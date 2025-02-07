/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Enrollment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_teacherId_fkey";

-- DropIndex
DROP INDEX "Enrollment_teacherId_idx";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "teacherId";

-- CreateTable
CREATE TABLE "_EnrollmentToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EnrollmentToTeacher_AB_unique" ON "_EnrollmentToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrollmentToTeacher_B_index" ON "_EnrollmentToTeacher"("B");

-- AddForeignKey
ALTER TABLE "_EnrollmentToTeacher" ADD CONSTRAINT "_EnrollmentToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrollmentToTeacher" ADD CONSTRAINT "_EnrollmentToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
