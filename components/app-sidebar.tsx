"use client"

import * as React from "react"
import { SchoolHeading } from "@/features/school/school-heading"
import { School } from "@prisma/client"
import {
  AwardIcon,
  BookIcon,
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
