/*
  Warnings:

  - Added the required column `score` to the `SubjectGradeSubComponentScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubjectGradeSubComponentScore" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;
