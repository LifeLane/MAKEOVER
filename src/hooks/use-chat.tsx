
'use client';

import { Slot } from '@radix-ui/react-slot';
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export enum ChatSize {
  Normal,
  Maximized,
}

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  size: ChatSize;
  setSize: Dispatch<SetStateAction<ChatSize>>;
  toggleSize: () => void;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ChatSize>(ChatSize.Normal);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm Mirror, your personal style assistant. How can I help you reflect your best self today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSize = () => {
    setSize(current => current === ChatSize.Normal ? ChatSize.Maximized : ChatSize.Normal);
  };

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, size, setSize, toggleSize, messages, setMessages, isLoading, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export const ChatTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, ...props }, ref) => {
    const { setIsOpen } = useChat();
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} onClick={() => setIsOpen(true)} {...props} />;
});

ChatTrigger.displayName = 'ChatTrigger';
