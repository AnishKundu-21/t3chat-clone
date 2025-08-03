"use client";

import * as React from "react";
import { Message } from "ai/react";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Icons
import { Bot, Copy, Check, RefreshCw } from "lucide-react";

// Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// The props now directly use the `Message` type from the Vercel AI SDK
interface ChatMessageProps extends Pick<Message, "role" | "content"> {}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex items-start gap-4 py-6">
      {/* Avatar Section */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
        {isAssistant ? (
          <Bot className="h-6 w-6 text-accent" />
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-2 group">
        <div className="font-bold text-foreground">
          {isAssistant ? "T3 chat" : "You"}
        </div>
        <div className="prose prose-sm prose-invert max-w-none text-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Hover Actions for Assistant Messages */}
        {isAssistant && content && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
