"use client"

import * as React from "react"

import { ChatSession } from "@/types"
import { ChatMessage } from "@/components/ChatMessage"
import { ChatInput } from "@/components/ChatInput"
import { Button } from "@/components/ui/button"

import { BookOpen, Code, Compass, Sparkles } from "lucide-react"

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
  const isEmpty = chat.messages.length <= 1

  return (
    /* border only on laptop / desktop */
    <div className="relative flex h-full max-h-screen flex-col bg-background lg:border-l lg:border-border">
      {/* ───────── EMPTY STATE ───────── */}
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
          <div className="mx-auto w-full max-w-2xl text-center">
            <h1 className="mb-8 text-2xl font-medium sm:text-3xl">
              How can I help you, Anish?
            </h1>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {[Sparkles, Compass, Code, BookOpen].map((Icon, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="bg-background hover:bg-muted focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {["Create", "Explore", "Code", "Learn"][i]}
                </Button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 text-sm text-foreground/80">
              <button className="hover:underline">How does AI work?</button>
              <button className="hover:underline">Are black holes real?</button>
            </div>
          </div>

          {/* sticky input */}
          <div className="sticky bottom-0 left-0 w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </div>
      ) : (
        /* ───────── CHAT HISTORY ───────── */
        <>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-0">
            {chat.messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}
          </div>

          {/* sticky input */}
          <div className="sticky bottom-0 left-0 w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </>
      )}
    </div>
  )
}
