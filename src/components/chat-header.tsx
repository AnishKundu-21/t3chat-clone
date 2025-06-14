"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  currentModel?: string;
  onModelChange?: (model: string) => void;
}

/* ── models you want to expose in the selector ──────────────────── */
const MODELS = ["GPT-4o mini", "GPT-4o", "Claude 3.5 Sonnet", "Llama 3"];

export function ChatHeader({
  currentModel = "GPT-4o mini",
  onModelChange,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between gap-2",
        "border-b bg-background/80 px-4 py-2 backdrop-blur"
      )}
    >
      {/* ─────── model selector ─────── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group inline-flex items-center gap-1 text-base font-medium"
          >
            {currentModel}
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {MODELS.map((model) => (
            <DropdownMenuItem
              key={model}
              onClick={() => onModelChange?.(model)}
              className={cn(currentModel === model && "font-semibold")}
            >
              {model}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ─────── share button (placeholder for future) ─────── */}
      <Button variant="ghost" size="icon" aria-label="Share conversation">
        <Share2 className="h-4 w-4" />
      </Button>
    </header>
  );
}
