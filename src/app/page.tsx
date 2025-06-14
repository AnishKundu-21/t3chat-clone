"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { v4 as uuidv4 } from "uuid"
import { mutate as globalMutate } from "swr"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/Sidebar"
import { FloatingButtons } from "@/components/FloatingButtons"
import { SearchDialog } from "@/components/SearchDialog"
import { AuthDialog } from "@/components/AuthDialog"
import { ChatPanel } from "@/components/ChatPanel"

import { useChats } from "@/hooks/useChats"
import { useChat } from "@/hooks/useChat"

/* ─────────────────────────  Local-only types  ───────────────────────── */
interface LocalMessage {
  role: "user" | "assistant"
  content: string
}
interface LocalChat {
  id: string
  title: string
  messages: LocalMessage[]
  updatedAt: number
}
const LOCAL_WELCOME: LocalMessage = {
  role: "assistant",
  content: "Hello! How can I help you?",
}
/* ─────────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  const { data: session } = useSession()
  const loggedIn = !!session

  /* UI state */
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = React.useState(false)

  /* Remote list + active thread */
  const { chats: remoteChats, mutate: mutateChats } = useChats()
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null)
  const { chat: remoteChat, sendMessage: sendRemoteMessage } =
    useChat(currentChatId)

  /* Auto-select newest when list arrives */
  React.useEffect(() => {
    if (loggedIn && !currentChatId && remoteChats.length) {
      setCurrentChatId(remoteChats[0].id)
    }
  }, [loggedIn, remoteChats, currentChatId])

  /* Local fallback */
  const [localChats, setLocalChats] = React.useState<LocalChat[]>(() => [
    {
      id: uuidv4(),
      title: "Welcome Chat",
      messages: [LOCAL_WELCOME],
      updatedAt: Date.now(),
    },
  ])
  const [localCurrentId, setLocalCurrentId] = React.useState(localChats[0].id)
  const activeLocalChat = localChats.find((c) => c.id === localCurrentId)!
  const isNewLocal = activeLocalChat.messages.length <= 1

  /* Shared input */
  const [input, setInput] = React.useState("")

  /* ─────────────────────  ACTIONS  ───────────────────── */

  /* send (either remote or local) */
  async function handleSend() {
    if (!input.trim()) return

    /* LOGGED-IN MODE */
    if (loggedIn) {
      /* existing chat */
      if (currentChatId) {
        await sendRemoteMessage("user", input)
        setInput("")
        return
      }
      /* no chat yet → create, then post first message */
      const createRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.slice(0, 40) }),
      })
      if (!createRes.ok) return console.error(await createRes.text())
      const newChat = await createRes.json()

      await fetch(`/api/chat/${newChat.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content: input }),
      })

      await mutateChats()
      globalMutate(`/api/chat/${newChat.id}`)
      setCurrentChatId(newChat.id)
      setInput("")
      return
    }

    /* ANONYMOUS MODE (local array) */
    const newMsg: LocalMessage = { role: "user", content: input }
    const updated = {
      ...activeLocalChat,
      messages: [...activeLocalChat.messages, newMsg],
      updatedAt: Date.now(),
      title:
        activeLocalChat.messages.length === 1
          ? input.slice(0, 40)
          : activeLocalChat.title,
    }
    setLocalChats((prev) =>
      [updated, ...prev.filter((c) => c.id !== updated.id)].sort(
        (a, b) => b.updatedAt - a.updatedAt
      )
    )
    setInput("")
  }

  /* create empty chat */
  async function handleNewChat() {
    if (loggedIn) {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
      if (!res.ok) return console.error(await res.text())
      const chat = await res.json()
      await mutateChats()
      setCurrentChatId(chat.id)
      setInput("")
      return
    }

    if (!isNewLocal) {
      const newChat: LocalChat = {
        id: uuidv4(),
        title: "",
        messages: [LOCAL_WELCOME],
        updatedAt: Date.now(),
      }
      setLocalChats((prev) => [newChat, ...prev])
      setLocalCurrentId(newChat.id)
      setInput("")
    }
  }

  /* delete chat */
  async function handleDeleteChat(id: string) {
    if (loggedIn) {
      const res = await fetch(`/api/chat/${id}`, { method: "DELETE" })
      if (!res.ok) return console.error(await res.text())
      await mutateChats()
      if (currentChatId === id) {
        const newest = remoteChats.filter((c) => c.id !== id)[0]
        setCurrentChatId(newest ? newest.id : null)
      }
      return
    }

    setLocalChats((prev) => prev.filter((c) => c.id !== id))
    if (localCurrentId === id) {
      const remaining = localChats.filter((c) => c.id !== id)
      setLocalCurrentId(remaining[0]?.id ?? "")
    }
  }

  /* select */
  function handleSelectChat(id: string) {
    loggedIn ? setCurrentChatId(id) : setLocalCurrentId(id)
    setInput("")
  }

  /* ─────────────  PROP OBJECTS  ───────────── */

  /* guarantee title is string (no null) */
  const sanitizedRemoteChat =
    remoteChat && remoteChat.id
      ? { ...remoteChat, title: remoteChat.title ?? "", updatedAt: new Date(remoteChat.updatedAt).getTime() }
      : { id: "", title: "", messages: [], updatedAt: 0 }

  const sanitizedLocalChat = { ...activeLocalChat, title: activeLocalChat.title }

  const chatPanelProps = loggedIn
    ? {
        chat: sanitizedRemoteChat,
        input,
        setInput,
        onSend: handleSend,
        userName: session?.user?.name ?? "User",
      }
    : {
        chat: sanitizedLocalChat,
        input,
        setInput,
        onSend: handleSend,
        userName: "Guest",
      }

  const sidebarProps = {
    onToggle: () => setIsCollapsed((p) => !p),
    onNewChat: handleNewChat,
    currentChatId: loggedIn ? currentChatId : localCurrentId,
    onSelectChat: handleSelectChat,
    onDeleteChat: handleDeleteChat,
    onOpenAuthDialog: () => setIsAuthDialogOpen(true),
  }

  const searchList = loggedIn
    ? remoteChats.map((c) => ({
        id: c.id,
        title: c.title ?? "New Chat",
        messages: [],
        updatedAt: new Date(c.updatedAt).getTime(),
      }))
    : localChats

  const isNewChat =
    loggedIn ? (remoteChat?.messages.length ?? 0) <= 1 : isNewLocal

  /* ─────────────  RENDER  ───────────── */
  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {isCollapsed ? (
          <FloatingButtons
            onToggle={() => setIsCollapsed(false)}
            isNewChat={isNewChat}
            onNewChat={handleNewChat}
            onSearchClick={() => setIsSearchOpen(true)}
          />
        ) : (
          <Sidebar {...sidebarProps} />
        )}

        <main className="flex-1">
          <ChatPanel {...chatPanelProps} />
        </main>

        <SearchDialog
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          chats={searchList as any /* TS satisfied */}
          onSelectChat={handleSelectChat}
        />

        <AuthDialog
          open={isAuthDialogOpen}
          onOpenChange={setIsAuthDialogOpen}
        />
      </div>
    </TooltipProvider>
  )
}
