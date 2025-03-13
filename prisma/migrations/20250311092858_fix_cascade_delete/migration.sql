/*
  Warnings:

  - Made the column `programOfferingId` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_programOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_programOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_courseId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_gradeYearLevelId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_programOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentGradingPeriod" DROP CONSTRAINT "EnrollmentGradingPeriod_programOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_programOfferingId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFinalGrade" DROP CONSTRAINT "StudentFinalGrade_gradingPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFinalGrade" DROP CONSTRAINT "StudentFinalGrade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectGrade" DROP CONSTRAINT "SubjectGrade_gradingPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectGradeComponent" DROP CONSTRAINT "SubjectGradeComponent_createdById_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "programOfferingId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "GradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_gradeYearLevelId_fkey" FOREIGN KEY ("gradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentGradingPeriod" ADD CONSTRAINT "EnrollmentGradingPeriod_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeComponent" ADD CONSTRAINT "SubjectGradeComponent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "EnrollmentGradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
