import { Metadata } from "next"
import Link from "next/link"
import {
  getEnrollments,
  GetEnrollmentsArgs,
} from "@/features/enrollments/queries"
import { InboxIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AppContent } from "@/components/app-content"
import { AppHeader } from "@/components/app-header"
import { CourseFilter } from "@/components/course-filter"
import { GradeSectionFilter } from "@/components/grade-section-filter"
import { Pagination } from "@/components/pagination"
import { ProgramOfferingFilter } from "@/components/program-offering-filter"
import { SchoolYearFilter } from "@/components/school-year-filter"

export const metadata: Metadata = {
  title: "Classes",
}

async function EnrollmentClassesPage({
  searchParams,
}: {
  searchParams: GetEnrollmentsArgs
}) {
  const { enrollments, pageInfo } = await getEnrollments(searchParams)

  return (
    <>
      <AppHeader pageTitle="Classes" />
      <AppContent>
        <div className="flex items-center gap-4">
          <ProgramOfferingFilter />
          <SchoolYearFilter shouldSetToFirstOption />
          <CourseFilter />
          <GradeSectionFilter />
        </div>
        {enrollments.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
            <InboxIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              No classes to display. Create an Enrollment now.
            </p>
            <Button asChild size="sm">
              <Link
                href={{ pathname: "/enrollments/new", query: searchParams }}
              >
                <PlusIcon className="size-4" /> Create Enrollment
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id}>
                <div className="space-y-3">
                  <div className="border-primary flex items-center gap-3 border-l-2 pl-4 text-sm font-semibold uppercase">
                    <p>
                      S.Y. {enrollment.schoolYear.title}{" "}
                      {enrollment.semester.title} {enrollment.course.code} |{" "}
                      {enrollment.gradeYearLevel.displayName}
                      {enrollment.gradeYearLevel.level} -{" "}
                      {enrollment.section.name}{" "}
                    </p>
                    {enrollment._count.students === 0 ? (
                      <Badge variant="warn" className="normal-case">
                        No students yet.
                      </Badge>
                    ) : (
                      <Badge variant="success" className="normal-case">
                        {enrollment._count.students} students
                      </Badge>
                    )}
                  </div>
                  <ul className="grid grid-cols-4 gap-4">
                    {enrollment.subjects.map((c) => (
                      <li key={c.id}>
                        <Link href={`/classes/${c.id}`}>
                          <Card
                            className="bg-accent/40 hover:border-primary relative rounded-lg"
                            title="View class record"
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between text-xs font-normal">
                                <p className="text-muted-foreground uppercase">
                                  Grade & Section
                                </p>
                                <p className="font-semibold uppercase">
                                  {enrollment.gradeYearLevel.displayName}{" "}
                                  {enrollment.gradeYearLevel.level} -{" "}
                                  {enrollment.section.name}
                                </p>
                              </CardTitle>
                              <CardTitle className="flex items-center justify-between text-xs font-normal">
                                <p className="text-muted-foreground uppercase">
                                  Subject
                                </p>
                                <p className="line-clamp-1 max-w-[50%] font-semibold uppercase">
                                  {!c.subject.code || c.subject.code === "--"
                                    ? c.subject.title
                                    : c.subject.code}
                                </p>
                              </CardTitle>
                              <CardTitle className="flex items-center justify-between text-xs font-normal">
                                <p className="text-muted-foreground uppercase">
                                  Teacher
                                </p>
                                <p className="font-semibold uppercase">
                                  {c.teacher.lastName}, {c.teacher.firstName}{" "}
                                  {c.teacher.middleName} {c.teacher.suffix}
                                </p>
                              </CardTitle>
                            </CardHeader>
                          </Card>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pageInfo && <Pagination pageInfo={pageInfo} />}
      </AppContent>
    </>
  )
}

export default EnrollmentClassesPage

// import { type Metadata } from "next"
// import Link from "next/link"
// import { ClassActions } from "@/features/school-class/class-actions"
// import { ClassesTable } from "@/features/school-class/classes-table"
// import { getClasses, GetClassesArgs } from "@/features/school-class/queries"
// import { SchoolClassCard } from "@/features/school-class/school-class-card"
// import { Teacher } from "@prisma/client"
// import { InboxIcon } from "lucide-react"

// import { AppContent } from "@/components/app-content"
// import { AppHeader } from "@/components/app-header"
// import { CourseFilter } from "@/components/course-filter"
// import { GradeSectionFilter } from "@/components/grade-section-filter"
// import { Pagination } from "@/components/pagination"
// import { ProgramOfferingFilter } from "@/components/program-offering-filter"
// import { SchoolYearFilter } from "@/components/school-year-filter"
// import { ViewToggle } from "@/components/view-toggle"

// function getFullName(teacher: Teacher) {
//   return [
//     teacher.firstName,
//     teacher.middleName,
//     teacher.lastName,
//     teacher.suffix,
//   ]
//     .filter(Boolean)
//     .join(" ")
// }

// export const generateMetadata = async ({
//   searchParams,
// }: {
//   searchParams: GetClassesArgs
// }): Promise<Metadata> => {
//   if (searchParams.teacher) {
//     const { classes } = await getClasses(searchParams)
//     const firstClass = classes.at(0)

//     if (!firstClass)
//       return {
//         title: "Classes",
//       }

//     return {
//       title: `Classes of ${getFullName(firstClass.teacher)}`,
//     }
//   }

//   return {
//     title: "Classes",
//   }
// }

// async function ClassesPage({ searchParams }: { searchParams: GetClassesArgs }) {
//   const data = await getClasses(searchParams)

//   return (
//     <>
//       <AppHeader pageTitle="Classes" />
//       <AppContent>
//         <div className="flex items-center gap-4">
//           {/* Filter by program */}
//           <ProgramOfferingFilter />
//           {/* Filter by course */}
//           <CourseFilter />
//           {/* Filter by school year and semester */}
//           <SchoolYearFilter />
//           {/* Filter by grade/year level and section */}
//           <GradeSectionFilter />
//           <div className="ml-auto">
//             <ViewToggle />
//           </div>
//         </div>
//         {data?.classes?.length === 0 ? (
//           <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
//             <InboxIcon className="text-muted-foreground" />
//             <p className="text-muted-foreground text-center">
//               No classes found.
//             </p>
//           </div>
//         ) : (
//           <>
//             {searchParams.view === "list" ? (
//               <ClassesTable classes={data?.classes ?? []} />
//             ) : (
//               <ul className="grid grid-cols-4 gap-4">
//                 {data?.classes?.map((schoolClass) => (
//                   <li key={schoolClass.id} className="relative">
//                     <Link href={`/classes/${schoolClass.id}`}>
//                       <SchoolClassCard schoolClass={schoolClass} />
//                     </Link>
//                     <ClassActions classId={schoolClass.id} />
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </>
//         )}

//         {data?.pageInfo && <Pagination pageInfo={data.pageInfo} />}
//       </AppContent>
//     </>
//   )
// }

// export default ClassesPage
