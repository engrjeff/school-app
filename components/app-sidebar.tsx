"use client"

import * as React from "react"
import { SchoolHeading } from "@/features/school/school-heading"
import { School } from "@prisma/client"
import {
  ChartColumnBig,
  LayoutGrid,
  SchoolIcon,
  Settings,
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
import { NavReporting } from "@/components/nav-reporting"
import { NavSettings } from "@/components/nav-settings"
import { NavUser } from "@/components/nav-user"

const data = {
  user: {
    name: "Jeff Segovia",
    email: "jeff@school.org",
    avatar: "/avatars/shadcn.jpg",
  },
  mainMenu: [
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
  reporting: [
    {
      title: "Student Ratings",
      url: "#",
      icon: ChartColumnBig,
      isActive: true,
      items: [
        {
          title: "Grades",
          url: "#",
        },
        {
          title: "Rankings",
          url: "#",
        },
        {
          title: "Awardees",
          url: "#",
        },
      ],
    },
  ],
  settings: [
    {
      title: "School Profile",
      url: "/school-profile",
      icon: SchoolIcon,
    },
    {
      title: "Management",
      url: "#",
      icon: Settings,
      isActive: true,
      items: [
        {
          title: "Departments",
          url: "#",
        },
        {
          title: "School Year",
          url: "#",
        },
        {
          title: "Sections",
          url: "#",
        },
        {
          title: "Subjects",
          url: "#",
        },
      ],
    },
  ],
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
        <NavReporting items={data.reporting} />
        <NavSettings items={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
