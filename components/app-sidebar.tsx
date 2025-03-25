"use client"

import * as React from "react"
import { SchoolHeading } from "@/features/school/school-heading"
import { ROLE, School } from "@prisma/client"
import {
  AwardIcon,
  BookIcon,
  CalendarIcon,
  ChartColumnBigIcon,
  GridIcon,
  LayoutGridIcon,
  LayoutPanelTopIcon,
  LibraryIcon,
  SchoolIcon,
  SquareSigmaIcon,
  SquareStackIcon,
  Table2Icon,
  TablePropertiesIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"
import { Session } from "next-auth"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMainMenu } from "@/components/nav-main-menu"
import { NavUser } from "@/components/nav-user"

const data = {
  user: {
    name: "Jeff Segovia",
    email: "jeff@school.org",
    avatar: "/avatars/shadcn.jpg",
  },
  mainMenu: {
    heading: "Menu",
    items: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutGridIcon,
      },
      {
        name: "Teacher",
        url: "/teachers",
        icon: UserCheckIcon,
      },
      {
        name: "Student",
        url: "/students",
        icon: UsersIcon,
      },
    ],
  },
  curriculum: {
    heading: "Curriculum",
    items: [
      {
        name: "Program Offering",
        url: "/program-offerings",
        icon: BookIcon,
      },
      {
        name: "Course",
        url: "/courses",
        icon: SquareStackIcon,
      },
      {
        name: "Faculty",
        url: "/faculties",
        icon: LayoutPanelTopIcon,
      },
      {
        name: "Section",
        url: "/sections",
        icon: GridIcon,
      },
    ],
  },
  reporting: {
    heading: "School Reports",
    items: [
      {
        name: "Enrollment",
        url: "#",
        icon: TablePropertiesIcon,
      },
      {
        name: "Ranking",
        url: "#",
        icon: ChartColumnBigIcon,
      },
      {
        name: "Awards",
        url: "#",
        icon: AwardIcon,
      },
    ],
  },
  settings: {
    heading: "School",
    items: [
      {
        name: "School Year",
        url: "/school-years",
        icon: CalendarIcon,
      },
      {
        name: "Enrollment",
        url: "/enrollments",
        icon: LibraryIcon,
      },
      {
        name: "Class",
        url: "/classes",
        icon: Table2Icon,
      },
      {
        name: "School Profile",
        url: "/school-profile",
        icon: SchoolIcon,
      },
      {
        name: "Certificates",
        url: "/certificates",
        icon: AwardIcon,
      },
    ],
  },
}

const teacherMenu = {
  mainMenu: {
    heading: "Menu",
    items: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutGridIcon,
      },
      {
        name: "My Students",
        url: "/students",
        icon: UsersIcon,
      },
      {
        name: "My Classes",
        url: "/classes",
        icon: Table2Icon,
      },
    ],
  },
  settings: {
    heading: "Settings",
    items: [
      {
        name: "Grading",
        url: "/grading",
        icon: SquareSigmaIcon,
      },
      {
        name: "Enrollment",
        url: "/enrollments",
        icon: LibraryIcon,
      },
      {
        name: "School Profile",
        url: "/school-profile",
        icon: SchoolIcon,
      },
    ],
  },
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  school: School
  session: Session | null
}

export function AppSidebar({ school, session, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="z-50" {...props}>
      <SidebarHeader>
        <SchoolHeading school={school} />
      </SidebarHeader>
      <SidebarContent>
        {session?.user.role === ROLE.SCHOOLADMIN ? (
          <>
            <NavMainMenu menu={data.mainMenu} />
            <NavMainMenu menu={data.curriculum} />
            <NavMainMenu menu={data.settings} />
          </>
        ) : null}

        {session?.user.role === ROLE.TEACHER ? (
          <>
            <NavMainMenu menu={teacherMenu.mainMenu} />
            <NavMainMenu menu={teacherMenu.settings} />
          </>
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
