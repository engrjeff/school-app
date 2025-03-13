import Link from "next/link"
import {
  Class,
  Course,
  GradeYearLevel,
  ProgramOffering,
  SchoolYear,
  Section,
  Semester,
  Student,
  Subject,
  Teacher,
} from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SortLink } from "@/components/sort-link"

interface Props {
  classes: Array<
    Class & {
      schoolYear: SchoolYear
      semester: Semester
      programOffering: ProgramOffering
      course: Course
      gradeYearLevel: GradeYearLevel
      section: Section
      subject: Subject
      teacher: Teacher
      students: Student[]
    }
  >
}

export function ClassesTable({ classes }: Props) {
  return (
    <div>
      <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-1">
              <SortLink title="School Year" sortValue="schoolYear" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Semester" sortValue="semester" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Program" sortValue="program" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Course" sortValue="course" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Grade & Section" sortValue="gradeSection" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Teacher" sortValue="teacher" />
            </TableHead>
            <TableHead className="px-1">
              <SortLink title="Student Count" sortValue="student_count" />
            </TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id} className="hover:bg-transparent">
              <TableCell>S.Y. {c.schoolYear.title}</TableCell>
              <TableCell>{c.semester.title}</TableCell>
              <TableCell>{c.programOffering.code}</TableCell>
              <TableCell>
                <Link
                  href={`/courses/${c.courseId}`}
                  className="hover:underline"
                >
                  <p className="line-clamp-1">
                    {!c.course.code || c.course.code === "--"
                      ? c.course.title
                      : c.course.code}
                  </p>
                </Link>
              </TableCell>
              <TableCell>
                {c.gradeYearLevel.displayName} {c.gradeYearLevel.level}-
                {c.section.name}
              </TableCell>
              <TableCell>
                <Link
                  href={`/teachers/${c.teacherId}`}
                  className="hover:underline"
                >
                  {c.teacher.lastName}, {c.teacher.firstName}{" "}
                  {c.teacher.middleName} {c.teacher.suffix}
                </Link>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`#`} className="inline-block w-max">
                        <p className="text-center">
                          {c.students.length}{" "}
                          <span className="text-muted-foreground text-xs">
                            students
                          </span>
                        </p>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 text-white dark:bg-white dark:text-black">
                      <p>View students</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="link" asChild>
                  <Link href={`/classes/${c.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
