"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ChatSession } from "@/types";

// Child Components
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";

// UI Components & Icons
import { Button } from "@/components/ui/button";
import {
  BookOpen, Code, Compass, Moon, Sparkles, Sun, Wand2,
} from "lucide-react";

// Define the props this component will accept
interface ChatPanelProps {
  chat: ChatSession;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export function ChatPanel({ chat, input, setInput, onSend }: ChatPanelProps) {
  const { theme, setTheme } = useTheme();
  
  // This hook is essential to prevent hydration errors with the theme switcher
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we should show the welcome screen or the chat history
  const isEmpty = chat.messages.length <= 1;

  return (
    <div className="relative flex h-full max-h-screen flex-col">
      {/* Header for theme switcher and other actions */}
      <header className="absolute top-0 right-0 z-10 flex items-center p-4">
        <Button variant="ghost" size="icon">
          <Wand2 className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          size="icon"
        >
          {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* Conditionally render welcome screen or chat history */}
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-2xl px-4 text-center">
            <h1 className="mb-8 text-3xl font-medium">How can I help you, Anish?</h1>
            <div className="mb-8 flex justify-center gap-2">
              <Button variant="outline" className="bg-background hover:bg-muted"><Sparkles className="h-4 w-4 mr-2"/>Create</Button>
              <Button variant="outline" className="bg-background hover:bg-muted"><Compass className="h-4 w-4 mr-2"/>Explore</Button>
              <Button variant="outline" className="bg-background hover:bg-muted"><Code className="h-4 w-4 mr-2"/>Code</Button>
              <Button variant="outline" className="bg-background hover:bg-muted"><BookOpen className="h-4 w-4 mr-2"/>Learn</Button>
            </div>
            <div className="flex flex-col items-center gap-4 text-sm text-foreground/80">
              <button className="hover:underline">How does AI work?</button>
              <button className="hover:underline">Are black holes real?</button>
            </div>
          </div>
          <div className="absolute bottom-0 w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {chat.messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))}
          </div>
          <div className="w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </>
      )}
    </div>
  );
}
