/*
  Warnings:

  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinalGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradingCriteria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradingCriteriaComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnrollmentToFinalGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnrollmentToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EnrollmentToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GradeToGradingCriteria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_schoolYearId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "GradingCriteria" DROP CONSTRAINT "GradingCriteria_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "GradingCriteriaComponent" DROP CONSTRAINT "GradingCriteriaComponent_gradingCriteriaId_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToFinalGrade" DROP CONSTRAINT "_EnrollmentToFinalGrade_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToFinalGrade" DROP CONSTRAINT "_EnrollmentToFinalGrade_B_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToSubject" DROP CONSTRAINT "_EnrollmentToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToSubject" DROP CONSTRAINT "_EnrollmentToSubject_B_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToTeacher" DROP CONSTRAINT "_EnrollmentToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnrollmentToTeacher" DROP CONSTRAINT "_EnrollmentToTeacher_B_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToGradingCriteria" DROP CONSTRAINT "_GradeToGradingCriteria_A_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToGradingCriteria" DROP CONSTRAINT "_GradeToGradingCriteria_B_fkey";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "FinalGrade";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "GradingCriteria";

-- DropTable
DROP TABLE "GradingCriteriaComponent";

-- DropTable
DROP TABLE "_EnrollmentToFinalGrade";

-- DropTable
DROP TABLE "_EnrollmentToSubject";

-- DropTable
DROP TABLE "_EnrollmentToTeacher";

-- DropTable
DROP TABLE "_GradeToGradingCriteria";

-- CreateTable
CREATE TABLE "GradingPeriod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "schoolYearId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeComponent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "teacherId" TEXT NOT NULL,
    "gradingPeriodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeComponentPart" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "highestPossibleScore" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeComponentPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeComponentPartScore" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "gradeComponentPartId" TEXT NOT NULL,
    "parentGradeComponentId" TEXT NOT NULL,
    "studentGradeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeComponentPartScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGrade" (
    "id" TEXT NOT NULL,
    "gradingPeriodId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentFinalGrade" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "gradingPeriodId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "remarks" "GradeRemarks" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFinalGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GradeComponentToGradeComponentPart" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "GradingPeriod_classId_idx" ON "GradingPeriod"("classId");

-- CreateIndex
CREATE INDEX "Class_schoolId_idx" ON "Class"("schoolId");

-- CreateIndex
CREATE INDEX "Class_semesterId_idx" ON "Class"("semesterId");

-- CreateIndex
CREATE INDEX "Class_courseId_idx" ON "Class"("courseId");

-- CreateIndex
CREATE INDEX "Class_sectionId_idx" ON "Class"("sectionId");

-- CreateIndex
CREATE INDEX "Class_subjectId_idx" ON "Class"("subjectId");

-- CreateIndex
CREATE INDEX "GradeComponent_teacherId_idx" ON "GradeComponent"("teacherId");

-- CreateIndex
CREATE INDEX "GradeComponent_gradingPeriodId_idx" ON "GradeComponent"("gradingPeriodId");

-- CreateIndex
CREATE INDEX "GradeComponentPartScore_gradeComponentPartId_idx" ON "GradeComponentPartScore"("gradeComponentPartId");

-- CreateIndex
CREATE INDEX "GradeComponentPartScore_parentGradeComponentId_idx" ON "GradeComponentPartScore"("parentGradeComponentId");

-- CreateIndex
CREATE INDEX "GradeComponentPartScore_studentGradeId_idx" ON "GradeComponentPartScore"("studentGradeId");

-- CreateIndex
CREATE INDEX "StudentGrade_gradingPeriodId_idx" ON "StudentGrade"("gradingPeriodId");

-- CreateIndex
CREATE INDEX "StudentGrade_studentId_idx" ON "StudentGrade"("studentId");

-- CreateIndex
CREATE INDEX "StudentFinalGrade_classId_idx" ON "StudentFinalGrade"("classId");

-- CreateIndex
CREATE INDEX "StudentFinalGrade_studentId_idx" ON "StudentFinalGrade"("studentId");

-- CreateIndex
CREATE INDEX "StudentFinalGrade_gradingPeriodId_idx" ON "StudentFinalGrade"("gradingPeriodId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudent_AB_unique" ON "_ClassToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudent_B_index" ON "_ClassToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GradeComponentToGradeComponentPart_AB_unique" ON "_GradeComponentToGradeComponentPart"("A", "B");

-- CreateIndex
CREATE INDEX "_GradeComponentToGradeComponentPart_B_index" ON "_GradeComponentToGradeComponentPart"("B");

-- AddForeignKey
ALTER TABLE "GradingPeriod" ADD CONSTRAINT "GradingPeriod_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponent" ADD CONSTRAINT "GradeComponent_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "GradingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_gradeComponentPartId_fkey" FOREIGN KEY ("gradeComponentPartId") REFERENCES "GradeComponentPart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_parentGradeComponentId_fkey" FOREIGN KEY ("parentGradeComponentId") REFERENCES "GradeComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComponentPartScore" ADD CONSTRAINT "GradeComponentPartScore_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "GradingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentFinalGrade" ADD CONSTRAINT "StudentFinalGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "GradingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeComponentToGradeComponentPart" ADD CONSTRAINT "_GradeComponentToGradeComponentPart_A_fkey" FOREIGN KEY ("A") REFERENCES "GradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeComponentToGradeComponentPart" ADD CONSTRAINT "_GradeComponentToGradeComponentPart_B_fkey" FOREIGN KEY ("B") REFERENCES "GradeComponentPart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
