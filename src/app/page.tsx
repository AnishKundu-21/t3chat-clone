"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons from lucide-react
import {
  PanelLeftClose, Plus, Search, Settings, Bot, MessageSquare, PanelLeftOpen, ArrowUp, BookOpen, ChevronDown, Code, Compass, Paperclip, Sparkles, Sun, Moon, Wand2, Copy, Check, RefreshCw
} from "lucide-react";

// Markdown and Textarea Libraries
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { default as Textarea } from "react-textarea-autosize";

// =================================================================================
// TYPES
// =================================================================================
interface Message { role: "user" | "assistant"; content: string; }
interface ChatSession { id: string; title: string; messages: Message[]; updatedAt: number; }

// =================================================================================
// CHILD COMPONENT: FloatingButtons
// Renders when the sidebar is collapsed.
// =================================================================================
function FloatingButtons({
  onToggle,
  isNewChat,
  onNewChat,
  onSearchClick,
}: {
  onToggle: () => void;
  isNewChat: boolean;
  onNewChat: () => void;
  onSearchClick: () => void;
}) {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onToggle}><PanelLeftOpen className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">Open Sidebar</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onSearchClick}><Search className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">Search</TooltipContent></Tooltip>
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" disabled={isNewChat} onClick={onNewChat}><Plus className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent side="right">New Chat</TooltipContent></Tooltip>
    </div>
  );
}

// =================================================================================
// CHILD COMPONENT: SearchDialog
// The floating search window.
// =================================================================================
function SearchDialog({
  open,
  onOpenChange,
  chats,
  onSelectChat,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chats: ChatSession[];
  onSelectChat: (chatId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredChats = searchTerm ? chats.filter((chat) => (chat.title || "New Chat").toLowerCase().includes(searchTerm.toLowerCase())) : chats;
  const handleSelect = (chatId: string) => { onSelectChat(chatId); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-background"><DialogHeader><DialogTitle>Search Chats</DialogTitle></DialogHeader><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search your threads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9" /></div><div className="mt-4 max-h-[300px] overflow-y-auto">{filteredChats.length > 0 ? (filteredChats.map((chat) => (<Button key={chat.id} variant="ghost" onClick={() => handleSelect(chat.id)} className="w-full justify-start">{chat.title || "New Chat"}</Button>))) : (<p className="text-center text-sm text-muted-foreground py-4">No results found.</p>)}</div></DialogContent>
    </Dialog>
  );
}

// =================================================================================
// CHILD COMPONENT: Sidebar
// The full sidebar component.
// =================================================================================
function Sidebar({
  onToggle,
  onNewChat,
  chats,
  currentChatId,
  onSelectChat,
}: {
  onToggle: () => void;
  onNewChat: () => void;
  chats: ChatSession[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredChats = chats.filter((chat) => (chat.title || "New Chat").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex h-screen w-72 flex-col bg-muted/20 dark:bg-[#191921] p-2">
      <div className="flex items-center justify-between p-2"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent"><Bot className="h-5 w-5 text-accent-foreground" /></div><h1 className="text-lg font-bold">T3 chat</h1></div><Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0"><PanelLeftClose className="h-5 w-5" /></Button></div>
      <Separator className="my-2 bg-border" />
      <div className="flex flex-col gap-2"><Button onClick={onNewChat} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 dark:text-accent-foreground"><Plus className="mr-2 h-4 w-4" />New Chat</Button><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search your threads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border-0 bg-background/50 pl-9 focus-visible:ring-1 focus-visible:ring-ring" /></div></div>
      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2">{filteredChats.map((chat) => (<Button key={chat.id} variant={chat.id === currentChatId ? "secondary" : "ghost"} onClick={() => onSelectChat(chat.id)} className={cn("w-full justify-start truncate font-normal", chat.id === currentChatId && "font-semibold")}>{chat.title || "New Chat"}</Button>))}{filteredChats.length === 0 && searchTerm && (<p className="text-center text-sm text-muted-foreground mt-4">No chats found.</p>)}</nav>
      <div className="mt-auto"><Separator className="my-2 bg-border" /><div className="flex items-center p-2"><Avatar className="h-8 w-8"><AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><AvatarFallback>AN</AvatarFallback></Avatar><div className="ml-3 flex-1"><p className="text-sm font-semibold">Anish</p><p className="text-xs text-muted-foreground">Pro</p></div><Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button></div></div>
    </div>
  );
}

// =================================================================================
// CHILD COMPONENT: ChatMessage
// Renders a single message bubble.
// =================================================================================
function ChatMessage({ role, content }: { role: "user" | "assistant"; content: string; }) {
  const isAssistant = role === "assistant";
  const handleCopy = () => { navigator.clipboard.writeText(content); };

  return (
    <div className="w-full max-w-3xl mx-auto flex items-start gap-4 py-6"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#191921]"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">{isAssistant ? (<Bot className="h-6 w-6 text-accent" />) : (<Avatar className="h-10 w-10"><AvatarImage src="https://github.com/shadcn.png" alt="User" /><AvatarFallback>AN</AvatarFallback></Avatar>)}</div></div><div className="flex-1 space-y-2 group"><div className="font-bold text-foreground">{isAssistant ? "T3 chat" : "You"}</div><div className="prose prose-sm prose-invert max-w-none text-foreground/90"><ReactMarkdown>{content}</ReactMarkdown></div>{isAssistant && (<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><Button onClick={handleCopy} variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-4 w-4 text-muted-foreground" /></Button><Button variant="ghost" size="icon" className="h-7 w-7"><RefreshCw className="h-4 w-4 text-muted-foreground" /></Button></div>)}</div></div>
  );
}

// =================================================================================
// CHILD COMPONENT: ChatInput
// The text input area at the bottom.
// =================================================================================
function ChatInput({ input, setInput, onSend }: { input: string; setInput: (v: string) => void; onSend: () => void; }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } };
  return ( <div className="w-full max-w-3xl mx-auto px-4 py-4"><div className="relative rounded-xl border border-border bg-card p-2"><Textarea rows={1} maxRows={8} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message here..." className="w-full resize-none bg-transparent p-2 text-base placeholder:text-muted-foreground focus:outline-none" /><div className="flex items-center justify-between"><div className="flex gap-1"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">Gemini 2.5 Flash <ChevronDown className="h-4 w-4 ml-1" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"><Search className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"><Paperclip className="h-4 w-4" /></Button></div><Button onClick={onSend} size="icon" className="h-8 w-8 bg-accent hover:bg-accent/90 rounded-lg" disabled={!input.trim()}><ArrowUp className="h-4 w-4" /></Button></div></div></div> );
}

// =================================================================================
// CHILD COMPONENT: ChatPanel
// The main content area that holds the conversation or welcome screen.
// =================================================================================
function ChatPanel({ chat, input, setInput, onSend }: { chat: ChatSession; input: string; setInput: (v: string) => void; onSend: () => void; }) {
  const { theme, setTheme } = useTheme(); const [mounted, setMounted] = React.useState(false); React.useEffect(() => { setMounted(true); }, []); const isEmpty = chat.messages.length <= 1;
  return ( <div className="relative flex h-full max-h-screen flex-col"><header className="absolute top-0 right-0 z-10 flex items-center p-4"><Button variant="ghost" size="icon"><Wand2 className="h-5 w-5" /></Button><Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="ghost" size="icon">{mounted ? (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : null}<span className="sr-only">Toggle theme</span></Button></header>{isEmpty ? (<div className="flex h-full flex-col items-center justify-center"><div className="mx-auto w-full max-w-2xl px-4 text-center"><h1 className="mb-8 text-3xl font-medium">How can I help you, Anish?</h1><div className="mb-8 flex justify-center gap-2"><Button variant="outline" className="bg-background hover:bg-muted"><Sparkles className="h-4 w-4 mr-2" />Create</Button><Button variant="outline" className="bg-background hover:bg-muted"><Compass className="h-4 w-4 mr-2" />Explore</Button><Button variant="outline" className="bg-background hover:bg-muted"><Code className="h-4 w-4 mr-2" />Code</Button><Button variant="outline" className="bg-background hover:bg-muted"><BookOpen className="h-4 w-4 mr-2" />Learn</Button></div><div className="flex flex-col items-center gap-4 text-sm text-foreground/80"><button className="hover:underline">How does AI work?</button><button className="hover:underline">Are black holes real?</button></div></div><div className="absolute bottom-0 w-full"><ChatInput input={input} setInput={setInput} onSend={onSend} /></div></div>) : (<><div className="flex-1 overflow-y-auto">{chat.messages.map((msg, index) => (<ChatMessage key={index} role={msg.role} content={msg.content} />))}</div><div className="w-full"><ChatInput input={input} setInput={setInput} onSend={onSend} /></div></>)}</div> );
}

// =================================================================================
// PARENT COMPONENT: HomePage
// This is the main component that manages all the state and ties everything together.
// =================================================================================
export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [chats, setChats] = React.useState<ChatSession[]>([ { id: uuidv4(), title: "Welcome Chat", messages: [ { role: "assistant", content: "Hello! How can I help you, Anish?" }, ], updatedAt: Date.now(), }, { id: uuidv4(), title: "Vite vs React", messages: [{role: 'assistant', content: 'Comparing Vite and React...'}], updatedAt: Date.now() - 10000} ]);
  const [currentChatId, setCurrentChatId] = React.useState(chats[0].id);
  const [input, setInput] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId)!;
  const isNewChat = currentChat.messages.length <= 1;

  const handleSend = () => { if (!input.trim()) return; const newMessage: Message = { role: "user", content: input }; const updatedMessages = [...currentChat.messages, newMessage]; const updatedChat: ChatSession = { ...currentChat, messages: updatedMessages, updatedAt: Date.now(), title: currentChat.messages.length === 1 ? input.slice(0, 40) : currentChat.title, }; setChats((prev) => prev.map((chat) => (chat.id === currentChatId ? updatedChat : chat)).sort((a,b) => b.updatedAt - a.updatedAt)); setInput(""); };
  const handleNewChat = () => { if (!isNewChat) { const newChat: ChatSession = { id: uuidv4(), title: "", messages: [ { role: "assistant", content: "Hello! How can I help you, Anish?" }, ], updatedAt: Date.now(), }; setChats((prev) => [newChat, ...prev]); setCurrentChatId(newChat.id); setInput(""); } };
  const handleSelectChat = (chatId: string) => { setCurrentChatId(chatId); setInput(""); };
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {isCollapsed ? (
          <FloatingButtons onToggle={toggleSidebar} isNewChat={isNewChat} onNewChat={handleNewChat} onSearchClick={() => setIsSearchOpen(true)} />
        ) : (
          <Sidebar onToggle={toggleSidebar} onNewChat={handleNewChat} chats={chats} currentChatId={currentChatId} onSelectChat={handleSelectChat} />
        )}
        <main className="flex-1">
          <ChatPanel chat={currentChat} input={input} setInput={setInput} onSend={handleSend} />
        </main>
        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} chats={chats} onSelectChat={handleSelectChat} />
      </div>
    </TooltipProvider>
  );
}
