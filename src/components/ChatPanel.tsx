"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { ChatSession } from "@/types"
import { ChatMessage } from "@/components/ChatMessage"
import { ChatInput } from "@/components/ChatInput"
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
  const { data: session } = useSession()
  const router = useRouter()

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  function handleMagic() {
    router.push(session?.user ? "/settings/customization" : "/login")
  }

  const isEmpty = chat.messages.length <= 1

  return (
    <div className="relative flex h-full max-h-screen flex-col bg-background border-l border-border">
      {/* ───────── ACTION BAR ───────── */}
      <div
        className="glass bg-card/70 absolute right-4 top-4 z-10 flex items-center gap-1
                   rounded-lg p-1 backdrop-blur-2xl
                   shadow-xl focus-within:shadow-xl           /* keep drop-shadow */
                   focus-within:ring-0 focus-within:ring-offset-0"  /* FIX */
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMagic}
          className="focus:outline-none focus:ring-0 focus:ring-offset-0"     /* FIX */
        >
          <Wand2 className="h-5 w-5" />
          <span className="sr-only">Customization</span>
        </Button>

        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          size="icon"
          className="focus:outline-none focus:ring-0 focus:ring-offset-0"     /* FIX */
        >
          {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* ───────── WELCOME or CHAT HISTORY ───────── */}
      {isEmpty ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mx-auto w-full max-w-2xl px-4 text-center">
            <h1 className="mb-8 text-3xl font-medium">
              How can I help you, Anish?
            </h1>

            <div className="mb-8 flex justify-center gap-2">
              {[Sparkles, Compass, Code, BookOpen].map((Icon, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="bg-background hover:bg-muted
                             focus:outline-none focus:ring-0 focus:ring-offset-0" /* FIX */
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

          <div className="absolute bottom-0 w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {chat.messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}
          </div>

          <div className="w-full">
            <ChatInput input={input} setInput={setInput} onSend={onSend} />
          </div>
        </>
      )}
    </div>
  )
}
