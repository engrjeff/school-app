-- DropForeignKey
ALTER TABLE "SubjectGrade" DROP CONSTRAINT "SubjectGrade_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "ClassSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
