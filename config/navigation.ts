import { Box, LayoutDashboard, Package2, ShoppingBag } from 'lucide-react';

export const stores = [
  {
    name: 'CoFaith',
    logo: Package2,
    plan: 'Store',
  },
  {
    name: 'Epistle Co.',
    logo: Package2,
    plan: 'Store',
  },
  {
    name: 'Guava Electronics',
    logo: Package2,
    plan: 'Store',
  },
];

export const navigation = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Menu',
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Sales',
          url: '/sales',
          icon: ShoppingBag,
        },
        {
          title: 'Products',
          url: '/products',
          icon: Box,
        },
      ],
    },
  ],
};
