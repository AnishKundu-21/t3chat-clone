"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { ChatSession } from "@/types";
import { cn } from "@/lib/utils";

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons from lucide-react
import {
  PanelLeftClose,
  Plus,
  Search,
  Settings,
  Bot,
  LogOut,
  User as UserIcon,
} from "lucide-react";

// This interface defines all the props (data and functions)
// that this component expects to receive from its parent (HomePage).
interface SidebarProps {
  onToggle: () => void;
  onNewChat: () => void;
  chats: ChatSession[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onOpenAuthDialog: () => void;
}

export function Sidebar({
  onToggle,
  onNewChat,
  chats,
  currentChatId,
  onSelectChat,
  onOpenAuthDialog,
}: SidebarProps) {
  // Get the user's session data from the SessionProvider
  const { data: session } = useSession();

  // This state is managed internally by the Sidebar for its own search input
  const [searchTerm, setSearchTerm] = React.useState("");

  // This logic filters the chats based on the internal search term
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
        <Button onClick={onNewChat} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 dark:text-accent-foreground">
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

      {/* Auth-Aware Footer */}
      <div className="mt-auto">
        <Separator className="my-2 bg-border" />
        <div className="flex items-center p-2">
          {session ? (
            // If user is logged in:
            <>
              <Avatar className="h-8 w-8">
                {session.user?.image && <AvatarImage src={session.user.image} alt={session.user.name || 'User'} />}
                <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold">{session.user?.name}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // If user is logged out:
            <Button onClick={onOpenAuthDialog} className="w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
