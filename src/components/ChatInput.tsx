"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { default as Textarea } from "react-textarea-autosize"
import { ArrowUp, ChevronDown, Paperclip, Search } from "lucide-react"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSend: () => void
}

export function ChatInput({ input, setInput, onSend }: ChatInputProps) {
  // “Enter” sends   “Shift+Enter” adds new-line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      {/* frosted glass shell – identical to sidebar theme */}
      <div
        className="relative rounded-xl border border-white/25 dark:border-white/30
                   bg-white/30 dark:bg-white/10 backdrop-blur-md backdrop-saturate-150
                   shadow-lg p-2"
      >
        <Textarea
          rows={1}
          maxRows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here…"
          className="w-full resize-none bg-transparent p-2 text-base
                     placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="flex items-center justify-between">
          {/* left-hand utility buttons */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground
                         hover:bg-white/10 dark:hover:bg-white/15"
            >
              Gemini 2.5 Flash <ChevronDown className="ml-1 h-4 w-4" />
            </Button>

            {[Search, Paperclip].map((Icon) => (
              <Button
                key={Icon.displayName}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground
                           hover:bg-white/10 dark:hover:bg-white/15"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* SEND button – higher contrast & better visibility */}
          <Button
            onClick={onSend}
            size="icon"
            disabled={!input.trim()}
            className="h-8 w-8 rounded-md bg-accent text-accent-foreground
                       hover:bg-accent/90 active:scale-95
                       disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
