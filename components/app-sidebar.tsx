"use client"

import * as React from "react"
import { SchoolHeading } from "@/features/school/school-heading"
import { School } from "@prisma/client"
import {
  Award,
  Book,
  ChartColumnBig,
  LayoutGrid,
  SchoolIcon,
  SquareStack,
  TableProperties,
  UserCheck,
  Users,
} from "lucide-react"

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
        icon: LayoutGrid,
      },
      {
        name: "Teachers",
        url: "/teachers",
        icon: UserCheck,
      },
      {
        name: "Students",
        url: "/students",
        icon: Users,
      },
    ],
  },
  curriculum: {
    heading: "Curriculum",
    items: [
      {
        name: "Program Offerings",
        url: "/program-offerings",
        icon: Book,
      },
      {
        name: "Courses",
        url: "/courses",
        icon: SquareStack,
      },
    ],
  },
  reporting: {
    heading: "School Reports",
    items: [
      {
        name: "Grades",
        url: "#",
        icon: TableProperties,
      },
      {
        name: "Rankings",
        url: "#",
        icon: ChartColumnBig,
      },
      {
        name: "Awardees",
        url: "#",
        icon: Award,
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
}

export function AppSidebar({ school, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchoolHeading school={school} />
      </SidebarHeader>
      <SidebarContent>
        <NavMainMenu menu={data.mainMenu} />
        <NavMainMenu menu={data.curriculum} />
        <NavMainMenu menu={data.reporting} />
        <NavMainMenu menu={data.settings} />

        {/* <NavMainMenu menu={data.mainMenu} /> */}

        {/* <NavReporting items={data.reporting} />
        <NavSettings items={data.settings} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
