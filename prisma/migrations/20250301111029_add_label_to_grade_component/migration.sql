/*
  Warnings:

  - Added the required column `label` to the `GradeComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradeComponent" ADD COLUMN     "label" TEXT NOT NULL;
