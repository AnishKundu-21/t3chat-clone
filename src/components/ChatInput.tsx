"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { default as Textarea } from "react-textarea-autosize";
import { ArrowUp, ChevronDown, Paperclip, Search } from "lucide-react";

// Define the props for this component
interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ input, setInput, onSend }: ChatInputProps) {
  // This handler allows "Enter" to send and "Shift+Enter" for a new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4">
      <div className="relative rounded-xl border border-border bg-card p-2">
        <Textarea
          rows={1}
          maxRows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="w-full resize-none bg-transparent p-2 text-base placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Gemini 2.5 Flash <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={onSend}
            size="icon"
            className="h-8 w-8 bg-accent hover:bg-accent/90 rounded-lg"
            disabled={!input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
