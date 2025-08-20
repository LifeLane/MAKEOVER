
'use client';

import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, User, Minimize2, Maximize2, X } from 'lucide-react';
import { getStyleBotResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useChat, ChatSize } from '@/hooks/use-chat';
import { useIsMobile } from '@/hooks/use-mobile';


const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

type Conversation = {
    user: string;
    bot: string;
}

export function FloatingChatWidget() {
  const { 
    isOpen, 
    setIsOpen, 
    size, 
    toggleSize,
    messages,
    setMessages,
    isLoading,
    setIsLoading
  } = useChat();

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            setTimeout(() => {
                viewport.scrollTop = viewport.scrollHeight;
            }, 100);
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);
  
  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [isOpen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { sender: 'user', text: values.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    const conversationHistory: Conversation[] = messages
        .slice(1) // Remove initial bot message
        .reduce((acc, msg, i, arr) => {
            if (msg.sender === 'user') {
                // Find the next bot message
                const nextBotMsg = arr.slice(i + 1).find(m => m.sender === 'bot');
                if (nextBotMsg) {
                    acc.push({ user: msg.text, bot: nextBotMsg.text });
                }
            }
            return acc;
        }, [] as Conversation[]);
    
    const result = await getStyleBotResponse({
      message: values.message,
      history: conversationHistory,
    });
    
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setMessages((prev) => [...prev, {sender: 'bot', text: "Sorry, I'm having a little trouble right now. Please try again later."}]);
    } else {
      const botMessage: Message = { sender: 'bot', text: result.response };
      setMessages((prev) => [...prev, botMessage]);
    }

    setIsLoading(false);
  }

  return (
    <>
      <AnimatePresence>
        {!isMobile && !isOpen && (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                  "w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-primary-foreground",
                  "transition-transform duration-300 ease-in-out",
                  !isOpen && "animate-pulse-slow"
                )}
                aria-label="Open Chat"
              >
                <Bot size={32} />
              </motion.button>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                "fixed z-50 rounded-lg bg-card border shadow-xl flex flex-col",
                "transition-all duration-300 ease-in-out",
                 // Maximized state will be constrained by inset, normal is fixed size
                size === ChatSize.Normal && !isMobile
                  ? "bottom-24 right-6 w-[400px] h-[600px]" 
                  : "inset-4 md:inset-8" 
            )}
          >
            <header className="p-4 border-b flex justify-between items-center cursor-move bg-card rounded-t-lg">
              <h2 className="text-lg font-headline flex items-center gap-2"><Bot size={20}/> Mirror</h2>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="w-6 h-6" onClick={toggleSize}>
                    {size === ChatSize.Normal ? <Maximize2 size={16}/> : <Minimize2 size={16}/>}
                 </Button>
                 <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setIsOpen(false)}>
                    <X size={16} />
                 </Button>
              </div>
            </header>
            <ScrollArea className="flex-1 bg-background" ref={scrollAreaRef}>
              <div className="space-y-6 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className='rounded-lg px-4 py-2 bg-muted w-40'>
                      <Skeleton className="h-4 w-10/12" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <footer className="p-4 border-t bg-card rounded-b-lg">
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <Input
                  {...form.register('message')}
                  placeholder="Ask Mirror for advice..."
                  autoComplete="off"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <SendHorizonal />
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
