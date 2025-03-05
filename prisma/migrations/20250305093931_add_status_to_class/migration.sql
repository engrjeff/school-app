-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "status" "ClassStatus" NOT NULL DEFAULT 'ONGOING';
