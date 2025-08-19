'use client';

import React from 'react';
import { Button } from './ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, icon, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h2 className="text-2xl font-bold font-headline">{title}</h2>
      <p className="mt-2 text-muted-foreground max-w-md">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
