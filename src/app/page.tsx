"use client";

import * as React from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PanelLeftOpen,
  Plus,
  Search,
  // ... other icons for ChatPanel
  ArrowUp, ChevronDown, Paperclip, Zap
} from "lucide-react";

import { ChatMessage } from "@/components/chat-message";
import { default as Textarea } from "react-textarea-autosize";

// This is the new component for the floating buttons seen in the collapsed state
function FloatingButtons({ onToggle }: { onToggle: () => void }) {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Open Sidebar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Search</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">New Chat</TooltipContent>
      </Tooltip>
    </div>
  );
}

// --- ChatPanel and ChatInput can remain the same as the last version ---
// For completeness, here they are again.

interface Message {
  role: "user" | "assistant";
  content: string;
}
const sampleMessages: Message[] = [
  { role: "assistant", content: "Hello! I'm a pixel-perfect clone of the T3 Chat UI. This is the correct collapsed sidebar behavior." },
];

function ChatInput({ input, setInput, onSend }: { input: string, setInput: (v: string) => void, onSend: () => void }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4">
      <div className="relative rounded-2xl border border-[#39394b] bg-[#222230] p-1 shadow-[0_0_20px_4px_#6a47e530]">
        <Textarea rows={1} maxRows={8} value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message here..." className="w-full resize-none bg-transparent p-4 text-base placeholder:text-muted-foreground focus:outline-none" />
        <div className="flex items-center justify-between p-2 pt-0">
          <div className="flex gap-1"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">o3 <ChevronDown className="h-4 w-4 ml-1" /></Button><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Zap className="h-4 w-4 mr-2" /> High</Button><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Paperclip className="h-4 w-4 mr-2" /> Attach</Button></div>
          <Button onClick={onSend} size="icon" className="h-8 w-8 bg-accent hover:bg-accent/90" disabled={!input.trim()}><ArrowUp className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = React.useState<Message[]>(sampleMessages);
  const [input, setInput] = React.useState("");
  const isEmpty = messages.length <= 1;

  const handleSend = () => { if (!input.trim()) return; setMessages(prev => [...prev, { role: "user", content: input }]); setInput(""); };

  if (isEmpty) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-2xl px-4 text-center">
          <h1 className="mb-8 text-3xl font-medium">How can I help you, Anish?</h1>
          <div className="mb-8 flex justify-center gap-2"><Button variant="outline" className="border-[#39394b] bg-[#191921] hover:bg-muted">Create</Button><Button variant="outline" className="border-[#39394b] bg-[#191921] hover:bg-muted">Explore</Button><Button variant="outline" className="border-[#39394b] bg-[#191921] hover:bg-muted">Code</Button><Button variant="outline" className="border-[#39394b] bg-[#191921] hover:bg-muted">Learn</Button></div>
          <div className="flex flex-col items-center gap-4 text-sm text-foreground/80"><button className="hover:underline">How does AI work?</button><button className="hover:underline">Are black holes real?</button></div>
        </div>
        <div className="absolute bottom-0 w-full"><ChatInput input={input} setInput={setInput} onSend={handleSend} /></div>
      </div>
    );
  }
  
  return (
    <div className="relative flex h-full max-h-screen flex-col">
      <div className="flex-1 overflow-y-auto">{messages.map((msg, index) => (<ChatMessage key={index} role={msg.role} content={msg.content} />))}</div>
      <div className="w-full"><ChatInput input={input} setInput={setInput} onSend={handleSend} /></div>
    </div>
  );
}

// --- The Final Page ---
export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Conditional Rendering: Show either the full sidebar or the floating buttons */}
        {isCollapsed ? (
          <FloatingButtons onToggle={toggleSidebar} />
        ) : (
          <Sidebar onToggle={toggleSidebar} />
        )}
        <main className="flex-1">
          <ChatPanel />
        </main>
      </div>
    </TooltipProvider>
  );
}