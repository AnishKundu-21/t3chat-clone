"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Message {
  role: "user" | "assistant";
  content: string;
}
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chats: ChatSession[];
  onSelectChat: (chatId: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  chats,
  onSelectChat,
}: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredChats = searchTerm
    ? chats.filter((chat) =>
        (chat.title || "New Chat")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : chats;

  const handleSelect = (chatId: string) => {
    onSelectChat(chatId);
    onOpenChange(false); // Close the dialog on selection
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Search Chats</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => handleSelect(chat.id)}
                className="w-full justify-start"
              >
                {chat.title || "New Chat"}
              </Button>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No results found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
