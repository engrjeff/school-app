/*
  Warnings:

  - The values [LISTED] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `title` on the `GradeYearLevel` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `GradeYearLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `GradeYearLevel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudentStatus_new" AS ENUM ('REGISTERED', 'ENROLLED', 'DROPPED', 'TRANSFERRED');
ALTER TABLE "Student" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Student" ALTER COLUMN "status" TYPE "StudentStatus_new" USING ("status"::text::"StudentStatus_new");
ALTER TYPE "StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "StudentStatus_old";
ALTER TABLE "Student" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
COMMIT;

-- AlterTable
ALTER TABLE "GradeYearLevel" DROP COLUMN "title",
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "currentCourseId" TEXT,
ADD COLUMN     "currentGradeYearLevelId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'REGISTERED';

-- CreateIndex
CREATE INDEX "Student_currentGradeYearLevelId_idx" ON "Student"("currentGradeYearLevelId");

-- CreateIndex
CREATE INDEX "Student_currentCourseId_idx" ON "Student"("currentCourseId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_currentGradeYearLevelId_fkey" FOREIGN KEY ("currentGradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_currentCourseId_fkey" FOREIGN KEY ("currentCourseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
