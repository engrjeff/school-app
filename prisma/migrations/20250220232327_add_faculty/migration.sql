-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacultyToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Faculty_schoolId_idx" ON "Faculty"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_schoolId_title_key" ON "Faculty"("schoolId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "_FacultyToTeacher_AB_unique" ON "_FacultyToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_FacultyToTeacher_B_index" ON "_FacultyToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToTeacher" ADD CONSTRAINT "_FacultyToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacultyToTeacher" ADD CONSTRAINT "_FacultyToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
