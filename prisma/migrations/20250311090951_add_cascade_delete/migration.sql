-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSubject" DROP CONSTRAINT "ClassSubject_enrollmentClassId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentClass" DROP CONSTRAINT "EnrollmentClass_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "GradeComponent" DROP CONSTRAINT "GradeComponent_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "GradeComponentPartScore" DROP CONSTRAINT "GradeComponentPartScore_gradeComponentPartId_fkey";

-- DropForeignKey
ALTER TABLE "GradeComponentPartScore" DROP CONSTRAINT "GradeComponentPartScore_parentGradeComponentId_fkey";

-- DropForeignKey
ALTER TABLE "GradeComponentPartScore" DROP CONSTRAINT "GradeComponentPartScore_studentGradeId_fkey";

-- DropForeignKey
ALTER TABLE "StudentFinalGrade" DROP CONSTRAINT "StudentFinalGrade_classId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_gradingPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_courseId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectGrade" DROP CONSTRAINT "SubjectGrade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" DROP CONSTRAINT "SubjectGradeSubComponentScore_subjectGradeId_fkey";

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_gradeComponentPartId_fkey" FOREIGN KEY ("gradeComponentPartId") REFERENCES "GradeComponentPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_parentGradeComponentId_fkey" FOREIGN KEY ("parentGradeComponentId") REFERENCES "GradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "GradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" ADD CONSTRAINT "SubjectGradeSubComponentScore_subjectGradeId_fkey" FOREIGN KEY ("subjectGradeId") REFERENCES "SubjectGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_enrollmentClassId_fkey" FOREIGN KEY ("enrollmentClassId") REFERENCES "EnrollmentClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
