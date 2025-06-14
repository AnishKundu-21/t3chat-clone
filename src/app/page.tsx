"use client";

import * as React from "react";
import { useTheme } from "next-themes"; // Import the useTheme hook
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  // Icons for Floating Buttons
  PanelLeftOpen,
  Plus,
  
  // Icons for Empty State & Input
  ArrowUp,
  BookOpen,
  ChevronDown,
  Code,
  Compass,
  Paperclip,
  Search,
  Sparkles,
  Sun,
  Moon, // Import the Moon icon
  Wand2,
} from "lucide-react";

import { ChatMessage } from "@/components/chat-message";
import { default as Textarea } from "react-textarea-autosize";

// --- Main Components ---

function FloatingButtons({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onToggle}><PanelLeftOpen className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">Open Sidebar</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">Search</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Plus className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">New Chat</TooltipContent></Tooltip>
    </div>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
}
const initialMessages: Message[] = [
  { role: "assistant", content: "Hello! How can I help you, Anish?" },
];

function ChatInput({ input, setInput, onSend }: { input: string, setInput: (v: string) => void, onSend: () => void }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4">
      <div className="relative rounded-xl border border-border bg-card p-2">
        <Textarea rows={1} maxRows={8} value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message here..." className="w-full resize-none bg-transparent p-2 text-base placeholder:text-muted-foreground focus:outline-none" />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">Gemini 2.5 Flash <ChevronDown className="h-4 w-4 ml-1" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"><Paperclip className="h-4 w-4" /></Button>
          </div>
          <Button onClick={onSend} size="icon" className="h-8 w-8 bg-accent hover:bg-accent/90 rounded-lg" disabled={!input.trim()}><ArrowUp className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");
  
  // --- THEME SWITCHER LOGIC ---
  const { theme, setTheme } = useTheme();

  const isEmpty = messages.length <= 1;
  const handleSend = () => { if (!input.trim()) return; setMessages(prev => [...prev, { role: "user", content: input }]); setInput(""); };

  return (
    <div className="relative flex h-full max-h-screen flex-col">
      <header className="absolute top-0 right-0 z-10 flex items-center p-4">
        <Button variant="ghost" size="icon"><Wand2 className="h-5 w-5" /></Button>
        
        {/* --- THE INTERACTIVE BUTTON --- */}
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>

      </header>

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
          <div className="absolute bottom-0 w-full"><ChatInput input={input} setInput={setInput} onSend={handleSend} /></div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">{messages.map((msg, index) => (<ChatMessage key={index} role={msg.role} content={msg.content} />))}</div>
          <div className="w-full"><ChatInput input={input} setInput={setInput} onSend={handleSend} /></div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {isCollapsed ? <FloatingButtons onToggle={toggleSidebar} /> : <Sidebar onToggle={toggleSidebar} />}
        <main className="flex-1"><ChatPanel /></main>
      </div>
    </TooltipProvider>
  );
}
