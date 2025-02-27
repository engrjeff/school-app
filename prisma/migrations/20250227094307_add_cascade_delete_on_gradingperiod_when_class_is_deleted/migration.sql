-- DropForeignKey
ALTER TABLE "GradingPeriod" DROP CONSTRAINT "GradingPeriod_classId_fkey";

-- AddForeignKey
ALTER TABLE "GradingPeriod" ADD CONSTRAINT "GradingPeriod_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
