import {
  Box,
  LayoutDashboard,
  LibraryIcon,
  Package2,
  SettingsIcon,
  ShoppingBag,
  TrendingUp,
  UserRoundCogIcon,
} from "lucide-react"

export const stores = [
  {
    name: "CoFaith",
    logo: Package2,
    plan: "Store",
  },
  {
    name: "Epistle Co.",
    logo: Package2,
    plan: "Store",
  },
  {
    name: "Guava Electronics",
    logo: Package2,
    plan: "Store",
  },
]

export const navigation = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Store",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Sales",
          url: "/sales",
          icon: TrendingUp,
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingBag,
        },
        {
          title: "Products",
          url: "/products",
          icon: Box,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Categories",
          url: "/categories",
          icon: LibraryIcon,
        },
        {
          title: "Employees",
          url: "/employees",
          icon: UserRoundCogIcon,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: SettingsIcon,
        },
      ],
    },
  ],
}
