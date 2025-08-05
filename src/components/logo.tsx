import { Brush } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-sidebar-foreground">
      <Brush className="h-7 w-7 text-sidebar-primary" />
      <h1 className="text-2xl font-bold font-headline">StyleGenius</h1>
    </div>
  );
};
