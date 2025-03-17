import Link from "next/link"
import {
  ClassSubject,
  Faculty,
  ProgramOffering,
  Subject,
  Teacher,
} from "@prisma/client"
import { InboxIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortLink } from "@/components/sort-link"

import { TeacherRowActions } from "./teacher-row-actions"

type TeacherEntries = Array<
  Teacher & {
    programs: ProgramOffering[]
    faculties: Faculty[]
    classSubjects: Array<
      ClassSubject & {
        subject: Subject
      }
    >
  }
>

export function TeachersTable({ teachers }: { teachers: TeacherEntries }) {
  return (
    <Table className="table-auto border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-1">
            <SortLink title="Name" sortValue="lastName" />
          </TableHead>
          <TableHead className="px-1 text-center">
            <SortLink title="Teacher ID" sortValue="teacherId" />
          </TableHead>
          <TableHead className="px-1">
            <SortLink title="Designation" sortValue="designation" />
          </TableHead>
          <TableHead>Faculties/Departments</TableHead>
          <TableHead className="px-1 text-center">
            <SortLink title="Gender" sortValue="gender" />
          </TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers?.length ? (
          teachers.map((teacher) => (
            <TableRow key={teacher.id} className="hover:bg-accent/50">
              <TableCell>
                <div>
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="hover:underline"
                    prefetch
                  >
                    <p>
                      {teacher.lastName}, {teacher.firstName}{" "}
                      {teacher.middleName} {teacher.suffix}
                    </p>
                  </Link>
                  <p className="text-muted-foreground text-xs">
                    {teacher.email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center font-mono">
                {teacher.teacherId}
              </TableCell>
              <TableCell>{teacher.designation}</TableCell>
              <TableCell>
                <div>
                  <p>{teacher.faculties.map((f) => f.title).join(", ")}</p>
                  <p className="text-muted-foreground text-xs">
                    {teacher.programs.at(0)?.title}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={teacher.gender}>
                  {teacher.gender.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">{teacher.phone}</TableCell>
              <TableCell className="text-center">
                <TeacherRowActions teacher={teacher} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={8} height={300}>
              <div className="text-muted-foreground flex flex-col justify-center text-center">
                <span>
                  <InboxIcon strokeWidth={1} className="inline-block" />
                </span>
                <p>No teachers listed yet.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
