/*
  Warnings:

  - Added the required column `order` to the `GradeComponentPart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradeComponentPart" ADD COLUMN     "order" INTEGER NOT NULL;
