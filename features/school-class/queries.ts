"use server"

import prisma from "@/lib/db"

export async function getSchoolClassById(classId: string) {
  const schoolClass = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      gradeYearLevel: true,
      course: true,
      teacher: true,
      subject: true,
      section: true,
      programOffering: true,
      schoolYear: true,
      semester: true,
      students: true,
    },
  })

  return schoolClass
}
