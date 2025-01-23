/*
  Warnings:

  - Added the required column `fullAddress` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "fullAddress" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "town" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
