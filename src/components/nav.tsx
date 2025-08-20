
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CalendarPlus,
  Shirt,
  Heart,
  User,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/event-styling', label: 'Events', icon: CalendarPlus },
  { href: '/visual-designer', label: 'Designer', icon: Palette },
  { href: '/collection', label: 'Collection', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col gap-2 p-2">
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              as={Link}
              href={item.href}
              isActive={pathname === item.href}
              className={cn(
                'w-full justify-start',
                pathname === item.href &&
                  'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
