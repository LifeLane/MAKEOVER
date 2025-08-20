'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizonal, Bot, User } from 'lucide-react';
import { getStyleBotResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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

export function StyleBotClient() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi there! I'm Kai, your personal style bot. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
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
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { sender: 'user', text: values.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    const conversationHistory: Conversation[] = messages
        .filter((msg, index) => msg.sender === 'bot' && messages[index -1]?.sender === 'user')
        .map((msg, index) => ({
            bot: msg.text,
            user: messages[messages.indexOf(msg)-1].text,
        }));
    
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
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg shadow-lg">
      <header className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline flex items-center gap-2"><Bot /> Style Bot</h1>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
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
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
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
      <footer className="p-4 border-t bg-background">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...form.register('message')}
            placeholder="Ask for fashion advice..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <SendHorizonal />
          </Button>
        </form>
      </footer>
    </div>
  );
}
