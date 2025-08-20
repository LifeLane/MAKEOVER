
'use client';

import { Brush } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './ui/sidebar';

export const Logo = () => {
  const { isMobile } = useSidebar();
  
  return (
    <div className={cn(
        "flex items-center gap-2",
        isMobile ? "text-foreground" : "text-sidebar-foreground"
      )}>
      <Brush className={cn(
        "h-7 w-7",
        isMobile ? "text-primary" : "text-sidebar-primary"
      )} />
      <h1 className="text-2xl font-bold font-headline">Makeover</h1>
    </div>
  );
};
