-- CreateTable
CREATE TABLE "EnrollmentClass" (
    "id" TEXT NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'ONGOING',
    "schoolYearId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "programOfferingId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "gradeYearLevelId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrollmentGradingPeriod" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrollmentGradingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGradeComponent" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGradeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGradeSubComponent" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "highestPossibleScore" DOUBLE PRECISION NOT NULL,
    "gradeComponentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGradeSubComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGradeSubComponentScore" (
    "id" TEXT NOT NULL,
    "subjectGradeId" TEXT NOT NULL,
    "subjectGradeComponentId" TEXT NOT NULL,
    "subjectGradeSubComponentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGradeSubComponentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSubject" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enrollmentClassId" TEXT NOT NULL,

    CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGrade" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "gradingPeriodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnrollmentClassToEnrollmentGradingPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EnrollmentClassToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SubjectGradeToSubjectGradeComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "EnrollmentClass_schoolYearId_idx" ON "EnrollmentClass"("schoolYearId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_semesterId_idx" ON "EnrollmentClass"("semesterId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_programOfferingId_idx" ON "EnrollmentClass"("programOfferingId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_courseId_idx" ON "EnrollmentClass"("courseId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_gradeYearLevelId_idx" ON "EnrollmentClass"("gradeYearLevelId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_sectionId_idx" ON "EnrollmentClass"("sectionId");

-- CreateIndex
CREATE INDEX "EnrollmentClass_status_idx" ON "EnrollmentClass"("status");

-- CreateIndex
CREATE INDEX "SubjectGradeComponent_createdById_idx" ON "SubjectGradeComponent"("createdById");

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponent_gradeComponentId_idx" ON "SubjectGradeSubComponent"("gradeComponentId");

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponentScore_subjectGradeSubComponentId_idx" ON "SubjectGradeSubComponentScore"("subjectGradeSubComponentId");

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponentScore_subjectGradeComponentId_idx" ON "SubjectGradeSubComponentScore"("subjectGradeComponentId");

-- CreateIndex
CREATE INDEX "SubjectGradeSubComponentScore_subjectGradeId_idx" ON "SubjectGradeSubComponentScore"("subjectGradeId");

-- CreateIndex
CREATE INDEX "ClassSubject_studentId_idx" ON "ClassSubject"("studentId");

-- CreateIndex
CREATE INDEX "ClassSubject_subjectId_idx" ON "ClassSubject"("subjectId");

-- CreateIndex
CREATE INDEX "ClassSubject_enrollmentClassId_idx" ON "ClassSubject"("enrollmentClassId");

-- CreateIndex
CREATE INDEX "SubjectGrade_gradingPeriodId_idx" ON "SubjectGrade"("gradingPeriodId");

-- CreateIndex
CREATE INDEX "SubjectGrade_subjectId_idx" ON "SubjectGrade"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "_EnrollmentClassToEnrollmentGradingPeriod_AB_unique" ON "_EnrollmentClassToEnrollmentGradingPeriod"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrollmentClassToEnrollmentGradingPeriod_B_index" ON "_EnrollmentClassToEnrollmentGradingPeriod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnrollmentClassToStudent_AB_unique" ON "_EnrollmentClassToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrollmentClassToStudent_B_index" ON "_EnrollmentClassToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectGradeToSubjectGradeComponent_AB_unique" ON "_SubjectGradeToSubjectGradeComponent"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectGradeToSubjectGradeComponent_B_index" ON "_SubjectGradeToSubjectGradeComponent"("B");

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_schoolYearId_fkey" FOREIGN KEY ("schoolYearId") REFERENCES "SchoolYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_programOfferingId_fkey" FOREIGN KEY ("programOfferingId") REFERENCES "ProgramOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_gradeYearLevelId_fkey" FOREIGN KEY ("gradeYearLevelId") REFERENCES "GradeYearLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentClass" ADD CONSTRAINT "EnrollmentClass_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeComponent" ADD CONSTRAINT "SubjectGradeComponent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponent" ADD CONSTRAINT "SubjectGradeSubComponent_gradeComponentId_fkey" FOREIGN KEY ("gradeComponentId") REFERENCES "SubjectGradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" ADD CONSTRAINT "SubjectGradeSubComponentScore_subjectGradeId_fkey" FOREIGN KEY ("subjectGradeId") REFERENCES "SubjectGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" ADD CONSTRAINT "SubjectGradeSubComponentScore_subjectGradeComponentId_fkey" FOREIGN KEY ("subjectGradeComponentId") REFERENCES "SubjectGradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGradeSubComponentScore" ADD CONSTRAINT "SubjectGradeSubComponentScore_subjectGradeSubComponentId_fkey" FOREIGN KEY ("subjectGradeSubComponentId") REFERENCES "SubjectGradeSubComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSubject" ADD CONSTRAINT "ClassSubject_enrollmentClassId_fkey" FOREIGN KEY ("enrollmentClassId") REFERENCES "EnrollmentClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "ClassSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGrade" ADD CONSTRAINT "SubjectGrade_gradingPeriodId_fkey" FOREIGN KEY ("gradingPeriodId") REFERENCES "EnrollmentGradingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrollmentClassToEnrollmentGradingPeriod" ADD CONSTRAINT "_EnrollmentClassToEnrollmentGradingPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "EnrollmentClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrollmentClassToEnrollmentGradingPeriod" ADD CONSTRAINT "_EnrollmentClassToEnrollmentGradingPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "EnrollmentGradingPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrollmentClassToStudent" ADD CONSTRAINT "_EnrollmentClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "EnrollmentClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrollmentClassToStudent" ADD CONSTRAINT "_EnrollmentClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectGradeToSubjectGradeComponent" ADD CONSTRAINT "_SubjectGradeToSubjectGradeComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "SubjectGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectGradeToSubjectGradeComponent" ADD CONSTRAINT "_SubjectGradeToSubjectGradeComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectGradeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
