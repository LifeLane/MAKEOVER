
import type { Metadata } from 'next';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarClose,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Nav } from '@/components/nav';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { FloatingChatWidget } from '@/components/floating-chat-widget';
import { ChatProvider, ChatTrigger } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Makeover',
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
       <ChatProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="p-4">
              <Logo />
              <SidebarClose />
            </SidebarHeader>
            <SidebarContent>
              <Nav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
              <div className='md:hidden'>
                <Logo />
              </div>
              <div className='flex items-center gap-2'>
                 <ChatTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Bot />
                    </Button>
                 </ChatTrigger>
              </div>
            </header>
            <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
          </SidebarInset>
          <BottomNav />
        </SidebarProvider>
        <FloatingChatWidget />
        <Toaster />
       </ChatProvider>
      </body>
    </html>
  );
}
