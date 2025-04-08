-- CreateTable
CREATE TABLE "CorrectResponse" (
    "id" TEXT NOT NULL,
    "gradeSubComponentId" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectResponseItem" (
    "id" TEXT NOT NULL,
    "correctResponseId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "correctCountPercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectResponseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CorrectResponse_gradeSubComponentId_key" ON "CorrectResponse"("gradeSubComponentId");

-- CreateIndex
CREATE INDEX "CorrectResponse_gradeSubComponentId_idx" ON "CorrectResponse"("gradeSubComponentId");

-- CreateIndex
CREATE INDEX "CorrectResponse_createdById_idx" ON "CorrectResponse"("createdById");

-- AddForeignKey
ALTER TABLE "CorrectResponse" ADD CONSTRAINT "CorrectResponse_gradeSubComponentId_fkey" FOREIGN KEY ("gradeSubComponentId") REFERENCES "SubjectGradeSubComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectResponse" ADD CONSTRAINT "CorrectResponse_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectResponseItem" ADD CONSTRAINT "CorrectResponseItem_correctResponseId_fkey" FOREIGN KEY ("correctResponseId") REFERENCES "CorrectResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
