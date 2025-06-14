"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Bot,
} from "lucide-react";

interface SidebarProps {
  onToggle: () => void;
}

const chatHistory = {
  Today: ["T3Chat Clone Frontend Plan"],
  "Last 7 Days": ["Vite.js vs React.js comparison"],
};

export function Sidebar({ onToggle }: SidebarProps) {
  return (
    // THE KEY: Use theme-aware background colors
    <div className="flex h-screen w-72 flex-col bg-muted/20 dark:bg-[#191921] p-2">
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          {/* Bot icon bg is accent, which works on both themes */}
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
        {/* THE KEY: Use different button styles for light vs dark */}
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 dark:text-accent-foreground">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {/* THE KEY: Use theme-aware background and ring for the input */}
          <Input
            placeholder="Search your threads..."
            className="w-full rounded-lg border-0 bg-background/50 pl-9 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Chat History */}
      <nav className="mt-4 flex-1 space-y-4 overflow-y-auto px-2">
        {Object.entries(chatHistory).map(([group, chats]) => (
          <div key={group}>
            <h2 className="text-xs font-semibold text-muted-foreground">
              {group}
            </h2>
            <div className="mt-2 space-y-1">
              {chats.map((chat) => (
                // Ghost buttons are automatically theme-aware
                <Button
                  key={chat}
                  variant="ghost"
                  className="w-full justify-start truncate font-normal text-foreground/80"
                >
                  {chat}
                </Button>
              ))}
            </div>
          </div>
        ))}
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
