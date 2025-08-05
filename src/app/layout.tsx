import type { Metadata } from 'next';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarClose,
} from '@/components/ui/sidebar';
import { Nav } from '@/components/nav';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'StyleGenius',
  description: 'AI-powered fashion designer and personal stylist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          {/* Desktop Sidebar */}
          <Sidebar className="hidden md:flex">
            <SidebarHeader className="p-4">
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <Nav />
            </SidebarContent>
          </Sidebar>
          
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
              {/* Mobile Sidebar Trigger - inside header for mobile layout */}
              <SidebarTrigger className="md:hidden" />
              
              {/* Desktop Sidebar Trigger - for toggling collapsed state */}
              <SidebarTrigger className="hidden md:flex" />
            </header>
            <main className="p-4 sm:p-6">{children}</main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}