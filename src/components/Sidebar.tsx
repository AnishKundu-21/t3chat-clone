"use client";

import * as React from "react";
import { ChatSession } from "@/types";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Bot,
} from "lucide-react";

// Define the props this component will accept
interface SidebarProps {
  onToggle: () => void;
  onNewChat: () => void;
  chats: ChatSession[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({
  onToggle,
  onNewChat,
  chats,
  currentChatId,
  onSelectChat,
}: SidebarProps) {
  // This component manages its own search term state
  const [searchTerm, setSearchTerm] = React.useState("");

  // It filters the chats prop based on its internal search term state
  const filteredChats = chats.filter((chat) =>
    (chat.title || "New Chat")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-72 flex-col bg-muted/20 dark:bg-[#191921] p-2">
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Bot className="h-5 w-5 text-accent-foreground" />
          </div>
          <h1 className="text-lg font-bold">T3 chat</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="my-2 bg-border" />

      {/* New Chat & Search */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onNewChat}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 dark:text-accent-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-0 bg-background/50 pl-9 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Chat History List */}
      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2">
        {filteredChats.map((chat) => (
          <Button
            key={chat.id}
            variant={chat.id === currentChatId ? "secondary" : "ghost"}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              "w-full justify-start truncate font-normal",
              chat.id === currentChatId && "font-semibold"
            )}
          >
            {chat.title || "New Chat"}
          </Button>
        ))}
        {filteredChats.length === 0 && searchTerm && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            No chats found.
          </p>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <Separator className="my-2 bg-border" />
        <div className="flex items-center p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold">Anish</p>
            <p className="text-xs text-muted-foreground">Pro</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
