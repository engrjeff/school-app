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
  SchoolIcon,
  SquareStackIcon,
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
        name: "Teachers",
        url: "/teachers",
        icon: UserCheckIcon,
      },
      {
        name: "Students",
        url: "/students",
        icon: UsersIcon,
      },
    ],
  },
  curriculum: {
    heading: "Curriculum",
    items: [
      {
        name: "Program Offerings",
        url: "/program-offerings",
        icon: BookIcon,
      },
      {
        name: "Courses",
        url: "/courses",
        icon: SquareStackIcon,
      },
      {
        name: "Faculties",
        url: "/faculties",
        icon: LayoutPanelTopIcon,
      },
      {
        name: "Sections",
        url: "/sections",
        icon: GridIcon,
      },
    ],
  },
  reporting: {
    heading: "School Reports",
    items: [
      {
        name: "Enrollments",
        url: "#",
        icon: TablePropertiesIcon,
      },
      {
        name: "Rankings",
        url: "#",
        icon: ChartColumnBigIcon,
      },
      {
        name: "Awardees",
        url: "#",
        icon: AwardIcon,
      },
    ],
  },
  settings: {
    heading: "School",
    items: [
      {
        name: "School Years",
        url: "/school-years",
        icon: CalendarIcon,
      },
      {
        name: "School Profile",
        url: "/school-profile",
        icon: SchoolIcon,
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
        url: "/my-students",
        icon: UsersIcon,
      },
      {
        name: "Classes",
        url: "/classes",
        icon: SquareStackIcon,
      },
    ],
  },
  settings: {
    heading: "Settings",
    items: [
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
    <Sidebar collapsible="icon" {...props}>
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
