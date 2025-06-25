"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ChatSession } from "@/types"

/* Child components */
import { ChatMessage } from "@/components/ChatMessage"
import { ChatInput } from "@/components/ChatInput"

/* UI + icons */
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Code,
  Compass,
  Moon,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react"

interface ChatPanelProps {
  chat: ChatSession
  input: string
  setInput: (v: string) => void
  onSend: () => void
}

export function ChatPanel({
  chat,
  input,
  setInput,
  onSend,
}: ChatPanelProps) {
  const { theme, setTheme } = useTheme()

  /* avoid hydration mismatch for theme toggle */
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isEmpty = chat.messages.length <= 1

  return (
    /* ───────── PANEL WRAPPER ─────────
       bg-background keeps the base panel colour,
       border-l uses theme token to separate from sidebar */
    <div className="relative flex h-full max-h-screen flex-col bg-background border-l border-border">
      {/* header: wand + theme toggle */}
      <header className="absolute right-0 top-0 z-10 flex items-center p-4">
        <Button variant="ghost" size="icon">
          <Wand2 className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          size="icon"
        >
          {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* welcome vs message history */}
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-2xl px-4 text-center">
            <h1 className="mb-8 text-3xl font-medium">
              How can I help you, Anish?
            </h1>

            {/* quick-action buttons */}
            <div className="mb-8 flex justify-center gap-2">
              <Button variant="outline" className="bg-background hover:bg-muted">
                <Sparkles className="mr-2 h-4 w-4" />
                Create
              </Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                <Compass className="mr-2 h-4 w-4" />
                Explore
              </Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                <Code className="mr-2 h-4 w-4" />
                Code
              </Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn
              </Button>
            </div>

            {/* example prompts */}
            <div className="flex flex-col items-center gap-4 text-sm text-foreground/80">
              <button className="hover:underline">How does AI work?</button>
              <button className="hover:underline">Are black holes real?</button>
            </div>
          </div>

          {/* input at bottom */}
          <div className="absolute bottom-0 w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </div>
      ) : (
        <>
          {/* messages */}
          <div className="flex-1 overflow-y-auto">
            {chat.messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
          </div>

          {/* composer */}
          <div className="w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </>
      )}
    </div>
  )
}
