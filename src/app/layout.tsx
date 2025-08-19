import type { Metadata } from 'next';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Nav } from '@/components/nav';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';

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
            <header className="sticky top-0 z-10 flex h-14 items-center justify-end border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
              {/* Desktop Sidebar Trigger */}
              <SidebarTrigger className="hidden md:flex" />
            </header>
            <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
          </div>
          <BottomNav />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
